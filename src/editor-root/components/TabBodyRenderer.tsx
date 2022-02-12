import React from 'react';

import { DummyTabOne } from '../../dummy-tab-1/DummyTabOne';
import { DummyTabTwo } from '../../dummy-tab-2/DummyTabTwo';
import { PanelTab, PanelTabType } from '../state/PanelTabTypes';

export class TabBodyRenderer {
  public static makeTabRenderer(tab: PanelTab) {
    switch (tab.type) {
      case PanelTabType.DUMMY_ONE:
        return <DummyTabOne dummyState={tab.state} />;
      case PanelTabType.DUMMY_TWO:
        return <DummyTabTwo dummyState={tab.state} />;
    }
  }
}
