import { DialogType, DialogViewState } from '../../dialogs/state/DialogViewState';
import { DockableUIState } from '../../dockable-ui/state/DockableUIState';
import { DuiPanelTab } from '../../dockable-ui/state/DuiPanel';
import { EditorStorage } from './EditorStorage';
import { LayoutModel, PanelModel } from '../../dockable-ui/model/PanelLayoutModel';
import { PanelTabType } from './PanelTabTypes';
import { RandomUtils } from '../../utils/RandomUtils';
import { toastManager } from '../../utils/ToastManager';

export interface PanelTab extends DuiPanelTab {
  type: PanelTabType;
}

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
    const tabId = RandomUtils.createId();
    const tab: PanelTab = {
      id: tabId,
      label: tabType,
      type: tabType,
    };
    this.tabMap.set(tab.id, tab);

    // Setup any states this tab requires

    // Give it to dockable ui to render
    this.dockableUiState.addPanelTab(tab, panelId);
  };

  public getTab(id: string) {
    return this.tabMap.get(id);
  }

  public loadLayout(layoutModel: LayoutModel) {
    // Before loading this new layout, clear any state from the previous layout
    this.resetLayoutState();

    // Pull out the tabs from the layout model
    layoutModel.panels.forEach((pModel) => {
      pModel.tabs.forEach((tab) => {
        // Create the tab state for this tab
        this.tabMap.set(tab.id, tab);
        //this.createTabState(tab);
      });
    });

    // Then give the layout to dockable ui to create panels
    this.dockableUiState.setLayout(layoutModel);
  }

  public startSaveLayout = () => {
    this.dialogViewState.showDialog(DialogType.SAVE_LAYOUT);
  };

  public saveLayout = (name: string) => {
    // Get panel layout from dockable ui
    const panelLayout = this.dockableUiState.getLayout();

    // Extend the DuiPanelModel to use PanelModel
    const panelModels: PanelModel[] = [];
    panelLayout.panels.forEach((pModel) => {
      // PanelModel uses PanelTabs instead of DuiPanelTabs
      const panelTabs: PanelTab[] = [];

      pModel.tabs.forEach((pModelTab) => {
        const tab = this.tabMap.get(pModelTab.id);
        if (tab) {
          panelTabs.push(tab);
        }
      });

      panelModels.push({ id: pModel.id, tabs: panelTabs });
    });

    const layoutModel: LayoutModel = {
      ...panelLayout,
      name,
      panels: panelModels,
    };

    // Then save the layout
    this.editorStorage.saveUserLayout(layoutModel);

    toastManager.successToast('Saved layout ' + name);
  };

  private onCloseTab = (tabId: string) => {
    // Remove any states made for this tab
    //this.tabStatesMap.delete(tabId);

    // Then remove the tab from the map
    this.tabMap.delete(tabId);
  };

  private loadEditor() {
    // Load the initial layout
    const layout = this.editorStorage.getInitialLayout();
    this.loadLayout(layout);
  }

  private resetLayoutState() {
    this.tabMap.clear();
    //this.tabStatesMap.clear();
  }
}
