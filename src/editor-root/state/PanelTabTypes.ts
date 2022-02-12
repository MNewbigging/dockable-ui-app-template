import { DuiPanelTab } from '../../dockable-ui/state/DuiPanel';
import { DummyTabOneState } from '../../dummy-tab-1/DummyTabOneState';
import { DummyTabTwoState } from '../../dummy-tab-2/DummyTabTwoState';

export enum PanelTabType {
  DUMMY_ONE = 'Dummy 1',
  DUMMY_TWO = 'Dummy 2',
}

export type PanelTab =
  | {
      type: PanelTabType.DUMMY_ONE;
      duiTab: DuiPanelTab;
      state: DummyTabOneState;
    }
  | {
      type: PanelTabType.DUMMY_TWO;
      duiTab: DuiPanelTab;
      state: DummyTabTwoState;
    };
