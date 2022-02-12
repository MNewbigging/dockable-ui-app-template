import { action, observable } from 'mobx';

import { DuiPanelContainerModel } from '../model/PanelLayoutModel';

export enum DuiPanelContainerFlow {
  ROW = 'row',
  COLUMN = 'column',
}

export interface DuiPanelContainerChild {
  id: string;
  basis: number;
}

export class DuiPanelContainer {
  public id: string;
  public parentId: string;
  @observable public flow = DuiPanelContainerFlow.ROW;
  @observable public children: DuiPanelContainerChild[] = [];

  private containerDiv?: HTMLDivElement;

  constructor(id: string, parentId: string) {
    this.id = id;
    this.parentId = parentId;
  }

  public toModel(): DuiPanelContainerModel {
    return {
      id: this.id,
      parentId: this.parentId,
      flow: this.flow,
      children: this.children,
    };
  }

  public static fromModel(model: DuiPanelContainerModel) {
    const panelContainer = new DuiPanelContainer(model.id, model.parentId);
    panelContainer.flow = model.flow;
    panelContainer.children = model.children;

    return panelContainer;
  }

  public setDiv(div: HTMLDivElement) {
    this.containerDiv = div;
  }

  public getChildBasis(childId: string): number | undefined {
    return this.children.find((ch) => ch.id === childId)?.basis;
  }

  @action public addChild(childId: string) {
    this.children.push({
      id: childId,
      basis: 100,
    });

    this.rebaseChildren();
  }

  @action public insertChild(id: string, insertAfterId: string) {
    const child: DuiPanelContainerChild = {
      id,
      basis: 100,
    };

    const insertIdx = this.children.findIndex((ch) => ch.id === insertAfterId) + 1;
    this.children.splice(insertIdx, 0, child);

    this.rebaseChildren();
  }

  @action public replaceChild(id: string, basis: number, toReplaceId: string) {
    const insertIdx = this.children.findIndex((ch) => ch.id === toReplaceId);
    this.children.splice(insertIdx, 1, { id, basis });
  }

  @action public removeChild(id: string) {
    this.children = this.children.filter((ch) => ch.id !== id);

    this.rebaseChildren();
  }

  @action public rebaseChildren() {
    this.children.forEach((ch) => (ch.basis = 100 / this.children.length));
  }

  @action public resizeChildren(e: MouseEvent, resizerIndex: number, resizer: HTMLDivElement) {
    // Gather required data from mouse, resizer and panel
    let mousePos = e.clientX;
    const contRect = this.containerDiv.getBoundingClientRect();
    let panelStart = contRect.left;
    let panelMax = contRect.width;
    const resizerRect = resizer.getBoundingClientRect();
    let resizerPos = resizerRect.left + resizerRect.width * 0.5;

    // Adjust above data based on flow direction
    if (this.flow === DuiPanelContainerFlow.COLUMN) {
      mousePos = e.clientY;
      panelStart = contRect.top;
      panelMax = contRect.height;
      resizerPos = resizerRect.top + resizerRect.height * 0.5;
    }

    // Find distance mouse has moved from resizer pos as a percentage of container size
    const mouseDelta = mousePos - resizerPos;
    const deltaPercent = (mouseDelta / panelMax) * 100;
    // delta percent is the rate of change in terms of flex basis %

    const childBefore = this.children[resizerIndex];
    const childAfter = this.children[resizerIndex + 1];

    // If the change would make a panel too small, adjust
    const minSize = 30;
    const minPercent = (minSize / panelMax) * 100;

    let childBeforeBasis = childBefore.basis + deltaPercent;
    let childAfterBasis = childAfter.basis - deltaPercent;

    // If the left side would be made too small
    if (childBeforeBasis < minPercent) {
      // Make left side minimum size
      childBeforeBasis = minPercent;
      // Right side is its current basis, plus whatever the left lost to get to min size
      childAfterBasis = childAfter.basis + childBefore.basis - minPercent;
    } else if (childAfterBasis < minPercent) {
      childAfterBasis = minPercent;
      childBeforeBasis = childBefore.basis + childAfter.basis - minPercent;
    }

    childBefore.basis = childBeforeBasis;
    childAfter.basis = childAfterBasis;
  }
}
