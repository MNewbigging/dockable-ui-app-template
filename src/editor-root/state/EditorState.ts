import { DialogType, DialogViewState } from '../../dialogs/state/DialogViewState';
import { DockableUIState } from '../../dockable-ui/state/DockableUIState';
import {
  DuiPanelModel,
  LayoutModel,
  PanelModel,
  TabModel,
} from '../../dockable-ui/model/PanelLayoutModel';
import { DuiPanelTab } from '../../dockable-ui/state/DuiPanel';
import { DummyTabOneState } from '../../dummy-tab-1/DummyTabOneState';
import { DummyTabTwoState } from '../../dummy-tab-2/DummyTabTwoState';
import { EditorStorage } from './EditorStorage';
import { PanelTab, PanelTabType } from './PanelTabTypes';
import { RandomUtils } from '../../utils/RandomUtils';
import { toastManager } from '../../utils/ToastManager';

// export interface PanelTab extends DuiPanelTab {
//   type: PanelTabType;
// }

export class EditorState {
  public dockableUiState = new DockableUIState();
  public editorStorage = new EditorStorage();
  public dialogViewState = new DialogViewState();
  private tabMap = new Map<string, PanelTab>();

  constructor() {
    this.dockableUiState.addEventListener('close-tab', this.onCloseTab);

    this.loadEditor();
  }

  public addTab = (tabType: PanelTabType, panelId?: string) => {
    // Create the tab
    // const tabId = RandomUtils.createId();
    // const tab: PanelTab = {
    //   id: tabId,
    //   label: tabType,
    //   type: tabType,
    // };
    // this.tabMap.set(tab.id, tab);

    let tab: PanelTab = undefined;
    const duiTab: DuiPanelTab = {
      id: RandomUtils.createId(),
      label: tabType,
    };
    switch (tabType) {
      case PanelTabType.DUMMY_ONE:
        tab = { type: tabType, duiTab, state: new DummyTabOneState() };
        break;
      case PanelTabType.DUMMY_TWO:
        tab = { type: tabType, duiTab, state: new DummyTabTwoState() };
        break;
    }

    // Save the tab
    this.tabMap.set(tab.duiTab.id, tab);

    // Give it to dockable ui to render
    this.dockableUiState.addPanelTab(tab.duiTab, panelId);
  };

  public getTab(id: string) {
    return this.tabMap.get(id);
  }

  public loadLayout(layoutModel: LayoutModel) {
    // Before loading this new layout, clear any state from the previous layout
    this.resetLayoutState();

    // Then give the layout to dockable ui to create panels
    this.dockableUiState.setLayout(layoutModel);

    // Pull out the tabs from the layout model
    layoutModel.panels.forEach((pModel) => {
      pModel.tabs.forEach((tab) => {
        this.addTab(tab.type, pModel.id);
      });
    });
  }

  public startSaveLayout = () => {
    this.dialogViewState.showDialog(DialogType.SAVE_LAYOUT);
  };

  public saveLayout = (name: string) => {
    // Get panel layout from dockable ui
    const duiLayout = this.dockableUiState.getLayout();

    // For each panel build it's model, by
    const panelModels: PanelModel[] = [];
    duiLayout.panels.forEach((duiPanel: DuiPanelModel) => {
      // Building each tab model, by
      const tabModels: TabModel[] = [];
      // Getting the types of its tabs
      duiPanel.tabs.forEach((duiTab: DuiPanelTab) => {
        const tab = this.getTab(duiPanel.id);
        if (tab) {
          tabModels.push({ ...duiTab, type: tab.type });
        }
      });

      panelModels.push({ ...duiPanel, tabs: tabModels });
    });

    const layoutModel: LayoutModel = {
      ...duiLayout,
      name,
      panels: panelModels,
    };

    // Extend the DuiPanelModel to use PanelModel
    // const panelModels: PanelModel[] = [];
    // duiLayout.panels.forEach((pModel) => {
    //   // PanelModel uses PanelTabs instead of DuiPanelTabs
    //   const panelTabs: PanelTab[] = [];

    //   pModel.tabs.forEach((pModelTab) => {
    //     const tab = this.tabMap.get(pModelTab.id);
    //     if (tab) {
    //       panelTabs.push(tab);
    //     }
    //   });

    //   panelModels.push({ id: pModel.id, tabs: panelTabs });
    // });

    // const layoutModel: LayoutModel = {
    //   ...duiLayout,
    //   name,
    //   panels: panelModels,
    // };

    // Then save the layout
    this.editorStorage.saveUserLayout(layoutModel);

    toastManager.successToast('Saved layout ' + name);
  };

  private onCloseTab = (tabId: string) => {
    // Remove the tab from the map
    this.tabMap.delete(tabId);
  };

  private loadEditor() {
    // Load the initial layout
    const layout = this.editorStorage.getInitialLayout();
    this.loadLayout(layout);
  }

  private resetLayoutState() {
    this.tabMap.clear();
  }
}
