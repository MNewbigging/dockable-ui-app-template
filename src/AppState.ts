import { DockableUIState } from './dockable-ui/state/DockableUIState';
import { DuiPanelTab } from './dockable-ui/state/DuiPanel';

export interface PanelTab extends DuiPanelTab {}

export class AppState {
  public dockableUiState = new DockableUIState();
}
