import './app.scss';

import React from 'react';
import { Button, MenuItem, NonIdealState } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { DockableUI } from './dockable-ui/components/DockableUI';
import { EditorState } from './editor-root/state/EditorState';
import { PanelTabType } from './editor-root/state/PanelTabTypes';
import { TabBodyRenderer } from './editor-root/components/TabBodyRenderer';

@observer
export class App extends React.Component {
  private appState = new EditorState();

  public render() {
    return (
      <div className={'app'}>
        <div className={'navbar-area'}></div>

        <div className={'main-area'}>
          <DockableUI
            duiState={this.appState.dockableUiState}
            renderTabBody={this.renderTabBody}
            renderPanelMenuItems={this.renderPanelMenuItems}
            renderNoPanels={this.renderNoPanels}
          />
        </div>
      </div>
    );
  }

  private renderTabBody = (tabId: string) => {
    // Get the tab to render
    const tab = this.appState.getTab(tabId);
    if (!tab) {
      return;
    }

    const tabBody = TabBodyRenderer.makeTabRenderer(tab);

    return <>{tabBody}</>;
  };

  private renderPanelMenuItems = (panelId: string) => {
    return (
      <>
        <MenuItem
          icon={'presentation'}
          text={'Viewer'}
          onClick={() => this.appState.addTab(PanelTabType.VIEWER, panelId)}
        />
      </>
    );
  };

  private renderNoPanels = () => {
    const { dockableUiState } = this.appState;

    return (
      <div className={'no-panels-screen'}>
        <NonIdealState
          icon={'page-layout'}
          title={'No panels'}
          description={'You have no panels! Click here to add one, or choose a layout.'}
          action={
            <Button
              icon={'add'}
              text={'Add a panel'}
              onClick={() => dockableUiState.setFlatLayout(1)}
            />
          }
        />
      </div>
    );
  };
}
