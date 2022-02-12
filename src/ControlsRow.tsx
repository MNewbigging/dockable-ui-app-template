import './controls-row.scss';

import React from 'react';

import { EditorState } from './editor-root/state/EditorState';

interface ControlsRowProps {
  appState: EditorState;
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
