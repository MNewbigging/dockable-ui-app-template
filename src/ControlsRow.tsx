import './controls-row.scss';

import React from 'react';

import { AppState } from './editor-root/state/AppState';

interface ControlsRowProps {
  appState: AppState;
}

export class ControlsRow extends React.Component<ControlsRowProps> {
  public render() {
    return (
      <div className={'controls-row'}>
        <button className={'button'}>Start</button>
      </div>
    );
  }
}
