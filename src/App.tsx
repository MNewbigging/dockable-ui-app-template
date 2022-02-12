import './app.scss';

import React, { CSSProperties } from 'react';
import { Button, MenuItem, NonIdealState } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { AppState } from './AppState';
import { DockableUI } from './dockable-ui/components/DockableUI';

@observer
export class App extends React.Component {
  private appState = new AppState();

  public render() {
    return (
      <div className={'app'}>
        <DockableUI
          duiState={this.appState.dockableUiState}
          renderTabBody={this.renderTabBody}
          renderPanelMenuItems={this.renderPanelMenuItems}
          renderNoPanels={this.renderNoPanels}
        />
      </div>
    );
  }

  private renderTabBody = (_tabId: string) => {
    // TODO - Get teh tab to render for this id

    // TODO - I shouldn't need to do this here; should be part of the dockable ui tab body wrapper
    const tabBodyStyle: CSSProperties = {
      width: '100%',
      height: '100%',
    };

    return <div style={tabBodyStyle}></div>;
  };

  private renderPanelMenuItems = (_panelId: string) => {
    return (
      <>
        <MenuItem icon={'add'} text={'Dummy item'} />
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
