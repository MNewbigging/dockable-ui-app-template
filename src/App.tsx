import './app.scss';

import React from 'react';
import { observer } from 'mobx-react';

import { AppState } from './AppState';
import { ControlsRow } from './ControlsRow';

@observer
export class App extends React.Component {
  private appState = new AppState();

  public render() {
    return (
      <div className={'app'}>
        <div className={'controls-area'}>
          <ControlsRow appState={this.appState} />
        </div>
        <div className={'canvas-area'}>
          <canvas></canvas>
        </div>
      </div>
    );
  }
}
