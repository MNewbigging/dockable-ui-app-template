import './viewer.scss';

import React from 'react';

export const canvasId = 'viewer-canvas';

export class Viewer extends React.Component {
  public render() {
    return <canvas id={canvasId} className={'viewer'}></canvas>;
  }
}
