import './dockable-ui.scss';

import React from 'react';
import { observer } from 'mobx-react';

import { DockableUIState } from '../state/DockableUIState';
import { DuiPanelContainerRenderer } from './DuiPanelContainerRenderer';
import { DuiPanelFrame } from './DuiPanelFrame';

interface Props {
  duiState: DockableUIState;
  renderTabBody: (panelId: string) => JSX.Element;
  renderPanelMenuItems?: (panelId: string) => JSX.Element;
  renderNoPanels?: () => JSX.Element;
}

@observer
export class DockableUI extends React.Component<Props> {
  public render() {
    const { duiState, renderNoPanels } = this.props;

    let content: JSX.Element = undefined;

    // If there are containers to render, render them
    if (duiState.rootContainer) {
      content = (
        <DuiPanelContainerRenderer
          key={`layout-${duiState.layoutId}-dpcr-${duiState.rootContainer.id}`}
          duiPanelContainer={duiState.rootContainer}
          duiState={duiState}
          renderPanel={(panelId: string, containerId: string) =>
            this.renderPanel(panelId, containerId)
          }
        />
      );
    } else if (renderNoPanels) {
      // Otherwise render given no panels content
      content = renderNoPanels();
    }

    return <div className={'dockable-ui-root'}>{content}</div>;
  }

  private renderPanel = (panelId: string, containerId: string) => {
    const { duiState, renderTabBody, renderPanelMenuItems } = this.props;

    const panel = duiState.getPanel(panelId);
    if (panel) {
      return (
        <DuiPanelFrame
          containerId={containerId}
          panel={panel}
          duiState={duiState}
          panelMenuItems={renderPanelMenuItems}
          renderTabBody={renderTabBody}
        />
      );
    }

    return <div>no panel</div>;
  };
}
