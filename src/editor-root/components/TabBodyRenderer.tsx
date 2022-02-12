import React from 'react';

import { PanelTab } from '../state/EditorState';
import { PanelTabType } from '../state/PanelTabTypes';
import { Viewer } from '../../viewer/Viewer';

export class TabBodyRenderer {
  public static makeTabRenderer(tab: PanelTab) {
    switch (tab.type) {
      case PanelTabType.VIEWER:
        return <Viewer />;
    }
  }
}
