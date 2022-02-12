import { action, observable } from 'mobx';

import { DuiPanelModel } from '../model/PanelLayoutModel';

export interface DuiPanelTab {
  id: string;
  label: string;
}

export class DuiPanel {
  public id: string;
  @observable public tabs: DuiPanelTab[] = [];
  @observable.ref public selectedTab?: DuiPanelTab;

  constructor(id: string) {
    this.id = id;
  }

  public toModel(): DuiPanelModel {
    return { id: this.id, tabs: this.tabs };
  }

  public static fromModel(model: DuiPanelModel) {
    const panel = new DuiPanel(model.id);
    panel.tabs = model.tabs;

    // Select first tab by default
    if (panel.tabs.length) {
      panel.selectedTab = panel.tabs[0];
    }

    return panel;
  }

  public getTab(id: string) {
    return this.tabs.find((tab) => tab.id === id);
  }

  @action public addTab(tab: DuiPanelTab) {
    this.tabs.push(tab);

    this.selectTab(tab);
  }

  @action public removeTab(id: string) {
    let nextTab: DuiPanelTab = this.selectedTab;

    // Is this the selected tab?
    if (this.selectedTab?.id === id) {
      // Need to select the previous tab - get index
      const idx = this.tabs.findIndex((tab) => tab.id === id);

      // Find tab before or after to select
      if (idx > 0) {
        nextTab = this.tabs[idx - 1];
      } else if (this.tabs.length > 1) {
        nextTab = this.tabs[idx + 1];
      } else {
        nextTab = undefined;
      }
    }

    // Remove the tab
    this.tabs = this.tabs.filter((tab) => tab.id !== id);

    // Select the next tab
    this.selectedTab = nextTab;
  }

  @action public selectTab(tab: DuiPanelTab) {
    // Sanity check - does this panel still own the tab
    if (this.tabs.find((t) => t.id === tab.id)) {
      this.selectedTab = tab;
    }
  }

  public isSelected(tab: DuiPanelTab) {
    return tab.id === this.selectedTab?.id;
  }
}
