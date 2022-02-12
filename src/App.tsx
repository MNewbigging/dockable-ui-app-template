import './app.scss';

import React, { CSSProperties } from 'react';
import { Button, MenuItem, NonIdealState } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { AppState } from './state/AppState';
import { DockableUI } from './dockable-ui/components/DockableUI';
import { PanelTabType } from './state/PanelTabTypes';

@observer
export class App extends React.Component {
  private appState = new AppState();

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

  private renderTabBody = (_tabId: string) => {
    // TODO - Get the tab to render for this id

    return <div>something</div>;
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
