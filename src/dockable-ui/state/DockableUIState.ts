import { action, observable } from 'mobx';

import { DuiLayoutModel } from '../model/PanelLayoutModel';
import { DuiPanel, DuiPanelTab } from './DuiPanel';
import { DuiPanelContainer, DuiPanelContainerFlow } from './DuiPanelContainer';
import { RandomUtils } from '../../utils/RandomUtils';

type DockableUIEvent = 'close-tab';

export class DockableUIState {
  @observable public rootContainer?: DuiPanelContainer;
  @observable public layoutId = RandomUtils.createId();

  // Overridable event callbacks
  private onDeleteTab?: (tabId: string) => void;

  private containerMap = new Map<string, DuiPanelContainer>();
  private panelMap = new Map<string, DuiPanel>();
  private selectedPanelId = '';

  public addEventListener(event: DockableUIEvent, callback: (tabId: string) => void) {
    switch (event) {
      case 'close-tab':
        this.onDeleteTab = callback;
        break;
    }
  }

  public hasLayout() {
    return this.rootContainer !== undefined;
  }

  public getLayout(): DuiLayoutModel {
    if (!this.rootContainer) {
      return;
    }

    const containers = Array.from(this.containerMap.values()).map((cont) => cont.toModel());
    const panels = Array.from(this.panelMap.values()).map((panel) => panel.toModel());

    return {
      id: this.layoutId,
      rootContainerId: this.rootContainer.id,
      containers,
      panels,
    };
  }

  public getContainer(id: string): DuiPanelContainer | undefined {
    return this.containerMap.get(id);
  }

  public getPanel(id: string): DuiPanel | undefined {
    return this.panelMap.get(id);
  }

  @action public setLayout(layoutModel: DuiLayoutModel) {
    this.clearLayoutData();

    // Build up the container map
    layoutModel.containers.forEach((cModel) => {
      const container = DuiPanelContainer.fromModel(cModel);
      this.containerMap.set(container.id, container);
    });

    // Then the panel map
    layoutModel.panels.forEach((pModel) => {
      const panel = DuiPanel.fromModel(pModel);
      this.panelMap.set(panel.id, panel);
    });

    // Then set the root container
    this.rootContainer = this.containerMap.get(layoutModel.rootContainerId);

    // Assign a new id for the layout - ensures renderers update if panel ids were the same as last layout
    this.layoutId = layoutModel.id;
  }

  @action public setFlatLayout(panelCount: number, flow?: DuiPanelContainerFlow) {
    this.clearLayoutData();

    const container = new DuiPanelContainer(RandomUtils.createId(), '');
    if (flow) {
      container.flow = flow;
    }

    for (let i = 0; i < panelCount; i++) {
      const panelId = RandomUtils.createId();
      const panel = new DuiPanel(panelId);
      this.panelMap.set(panelId, panel);
      container.addChild(panelId);
    }

    this.rootContainer = container;
    this.containerMap.set(this.rootContainer.id, this.rootContainer);
  }

  @action public setNestedLayout() {
    this.clearLayoutData();

    // Root container
    const rootContainer = new DuiPanelContainer(RandomUtils.createId(), '');

    // Left side is a panel
    const leftPanelId = RandomUtils.createId();
    const leftPanel = new DuiPanel(leftPanelId);
    this.panelMap.set(leftPanelId, leftPanel);
    rootContainer.addChild(leftPanelId);

    // Right side is a container with two panels
    const rightContainer = new DuiPanelContainer(RandomUtils.createId(), rootContainer.id);
    rightContainer.flow = DuiPanelContainerFlow.COLUMN;

    for (let i = 0; i < 2; i++) {
      const panelId = RandomUtils.createId();
      const panel = new DuiPanel(panelId);
      this.panelMap.set(panelId, panel);
      rightContainer.addChild(panelId);
    }

    rootContainer.addChild(rightContainer.id);

    this.containerMap.set(rootContainer.id, rootContainer);
    this.containerMap.set(rightContainer.id, rightContainer);

    this.rootContainer = rootContainer;
  }

  public selectPanel(panelId: string) {
    if (this.panelMap.has(panelId)) {
      this.selectedPanelId = panelId;
    }
  }

  @action public splitPanel = (
    containerId: string,
    panelId: string,
    flow: DuiPanelContainerFlow
  ) => {
    const container = this.containerMap.get(containerId);
    if (!container) {
      return;
    }

    // If the split follows the container's flow, new sibling panel
    // Or if there is only one panel in this container, we can re-flow it to suit the split
    if (container.flow === flow || container.children.length === 1) {
      // Re-flow (no effect if first clause above is true)
      container.flow = flow;

      // Make a new sibling panel
      const siblingId = RandomUtils.createId();
      container.insertChild(siblingId, panelId);
      const siblingPanel = new DuiPanel(siblingId);

      // Update state to track new panel
      this.panelMap.set(siblingId, siblingPanel);

      return; // done now!
    }

    // If the split is contrary to container's flow:

    // Make a new container as a child of current container, set its flow
    const childCont = new DuiPanelContainer(RandomUtils.createId(), container.id);
    childCont.flow = flow;

    // Child container gets the panel being split
    childCont.addChild(panelId);

    // It also gets the new panel as a result of the split
    const splitPanelId = RandomUtils.createId();
    const splitPanel = new DuiPanel(splitPanelId);
    childCont.addChild(splitPanelId);

    // Parent container loses the panel and gains the new child container
    // Maintain the same basis the panel had
    const panelBasis = container.getChildBasis(panelId);
    container.replaceChild(childCont.id, panelBasis, panelId);

    // Update state to track new container and panel
    this.containerMap.set(childCont.id, childCont);
    this.panelMap.set(splitPanelId, splitPanel);
  };

  @action public deletePanel = (containerId: string, panelId: string) => {
    // Remove panel from parent container
    const cont = this.containerMap.get(containerId);
    cont.removeChild(panelId);

    // Then from state map
    this.panelMap.delete(panelId);

    // If this was the last panel of that container, delete the container
    if (!cont.children.length) {
      this.deleteContainer(cont);
    }
  };

  @action public addPanelTab(tab: DuiPanelTab, panelId?: string) {
    let panel = this.panelMap.get(panelId ?? this.selectedPanelId);
    if (!panel) {
      // If there are no panels, make one
      if (!this.panelMap.size) {
        this.setFlatLayout(1);
      }

      // Then grab the first panel
      panel = this.panelMap.values().next().value;
    }

    panel.addTab(tab);
  }

  @action public moveTab(tabId: string, fromPanelId: string, toPanel: DuiPanel) {
    // If dropped on same panel, do nothing
    if (fromPanelId === toPanel.id) {
      return;
    }

    // Get the from panel
    const fromPanel = this.panelMap.get(fromPanelId);
    if (!fromPanel) {
      return;
    }

    // Get the tab
    const tab = fromPanel.getTab(tabId);
    if (!tab) {
      return;
    }

    // Remove it from 'from' panel
    fromPanel.removeTab(tab.id);

    // Add it to the new panel
    toPanel.addTab(tab);
  }

  @action public closeTab(tabId: string, panel: DuiPanel) {
    // Get panel to delete the tab
    panel.removeTab(tabId);

    // Fire event for tab deletion to update consumers
    if (this.onDeleteTab) {
      this.onDeleteTab(tabId);
    }
  }

  @action private deleteContainer(container: DuiPanelContainer) {
    this.containerMap.delete(container.id);

    // Was this the root container?
    if (container.id === this.rootContainer.id) {
      this.rootContainer = undefined;
      return; // nothing else to do
    }

    // Otherwise, parent needs to remove this container
    const parent = this.containerMap.get(container.parentId);
    parent.removeChild(container.id);

    // If the parent is also now empty, delete that; recurse
    if (!parent.children.length) {
      this.deleteContainer(parent);
    }
  }

  @action private clearLayoutData() {
    this.rootContainer = undefined;
    this.containerMap.clear();
    this.panelMap.clear();
    this.selectedPanelId = '';
  }
}
