import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

import { DummyTabOneState } from './DummyTabOneState';

interface Props {
  dummyState: DummyTabOneState;
}

export class DummyTabOne extends React.Component<Props> {
  public render() {
    const { dummyState } = this.props;

    return (
      <NonIdealState
        icon={'tank'}
        title={'Dummy tab one'}
        description={'The id of this tab is ' + dummyState.id}
      />
    );
  }
}
