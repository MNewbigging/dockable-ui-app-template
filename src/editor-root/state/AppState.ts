import { DockableUIState } from '../../dockable-ui/state/DockableUIState';
import { DuiPanelTab } from '../../dockable-ui/state/DuiPanel';
import { PanelTabType } from './PanelTabTypes';
import { RandomUtils } from '../../utils/RandomUtils';

export interface PanelTab extends DuiPanelTab {
  type: PanelTabType;
}

export class AppState {
  public dockableUiState = new DockableUIState();
  private tabMap = new Map<string, PanelTab>();

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
}
