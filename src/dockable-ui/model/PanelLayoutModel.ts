import { DuiPanelContainerChild, DuiPanelContainerFlow } from '../state/DuiPanelContainer';
import { DuiPanelTab } from '../state/DuiPanel';
import { PanelTab } from '../../editor-root/state/EditorState';

export interface DuiLayoutModel {
  id: string;
  rootContainerId: string;
  containers: DuiPanelContainerModel[];
  panels: DuiPanelModel[];
}

export interface DuiPanelContainerModel {
  id: string;
  parentId: string;
  flow: DuiPanelContainerFlow;
  children: DuiPanelContainerChild[];
}

export interface DuiPanelModel {
  id: string;
  tabs: DuiPanelTab[];
}

/**
 * In order to keep a separation between the dockable ui stuff and the app which uses it,
 * the editor, we have two models. The base model above is just enough info for the dockable
 * ui to function. The model below has extra info made outside of the dockable ui.
 *
 * This does mean a bit more code when saving and loading layouts though!
 */

export interface LayoutModel extends DuiLayoutModel {
  name: string;
  panels: PanelModel[];
}

export interface PanelModel {
  id: string;
  tabs: PanelTab[];
}
