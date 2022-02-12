import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

import { DummyTabTwoState } from './DummyTabTwoState';

interface Props {
  dummyState: DummyTabTwoState;
}

export class DummyTabTwo extends React.Component<Props> {
  public render() {
    const { dummyState } = this.props;

    return (
      <NonIdealState
        icon={'cargo-ship'}
        title={'Dummy tab 2'}
        description={'The id of this tab is ' + dummyState.id}
      />
    );
  }
}
