import './dui-panel-container-renderer.scss';

import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react';

import { DockableUIState } from '../state/DockableUIState';
import { DuiPanelContainer, DuiPanelContainerChild } from '../state/DuiPanelContainer';
import { DuiPanelResizer } from './DuiPanelResizer';

interface Props {
  duiPanelContainer: DuiPanelContainer;
  duiState: DockableUIState;
  renderPanel: (panelId: string, containerId: string) => JSX.Element;
}

@observer
export class DuiPanelContainerRenderer extends React.Component<Props> {
  private containerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (this.containerRef.current) {
      this.props.duiPanelContainer.setDiv(this.containerRef.current);
    }
  }

  public render() {
    const { duiPanelContainer } = this.props;

    // Get children with resize bars between them
    const children = this.renderChildren();

    const containerStyle: CSSProperties = {
      flexDirection: duiPanelContainer.flow,
    };

    return (
      <div
        ref={this.containerRef}
        className={'dui-panel-container-renderer'}
        style={containerStyle}
      >
        {children}
      </div>
    );
  }

  private renderChildren() {
    const { duiPanelContainer } = this.props;

    let childContent: JSX.Element[] = [];

    // If there's only one child, just render that
    if (duiPanelContainer.children.length === 1) {
      return this.renderChild(duiPanelContainer.children[0]);
    }

    // Otherwise, put a resize bar after each child but the last
    duiPanelContainer.children.forEach((child, idx) => {
      // First the child
      childContent.push(this.renderChild(child));
      // Then the resizer - if it's not the last child
      if (idx < duiPanelContainer.children.length - 1)
        childContent.push(
          <DuiPanelResizer
            key={`dpcr-resizer-${idx}`}
            container={duiPanelContainer}
            resizerIndex={idx}
          />
        );
    });

    return childContent;
  }

  private renderChild(child: DuiPanelContainerChild) {
    const { duiPanelContainer, duiState, renderPanel } = this.props;

    const childStyle: CSSProperties = {
      flexBasis: child.basis + '%',
    };

    // Child body - either a panel or container
    let childBody: JSX.Element = undefined;
    const container = duiState.getContainer(child.id);
    if (container) {
      // Render another container
      childBody = (
        <DuiPanelContainerRenderer
          key={`dpcr-${container.id}`}
          duiPanelContainer={container}
          duiState={duiState}
          renderPanel={renderPanel}
        />
      );
    } else {
      // Render the panel
      childBody = renderPanel(child.id, duiPanelContainer.id);
    }

    return (
      <div key={'container-child-' + child.id} className={'container-child'} style={childStyle}>
        {childBody}
      </div>
    );
  }
}
