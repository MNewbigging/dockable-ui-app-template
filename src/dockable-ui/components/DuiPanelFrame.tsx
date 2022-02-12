import './dui-panel-frame.scss';

import React from 'react';
import { Button, Divider, Icon, Menu, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { observer } from 'mobx-react';

import { DockableUIState } from '../state/DockableUIState';
import { DuiPanel, DuiPanelTab } from '../state/DuiPanel';
import { DuiPanelContainerFlow } from '../state/DuiPanelContainer';

interface TabDragData {
  tabId: string;
  fromPanelId: string;
}

interface Props {
  containerId: string;
  panel: DuiPanel;
  duiState: DockableUIState;
  renderTabBody: (tabId: string) => JSX.Element;
  panelMenuItems?: (panelId: string) => JSX.Element;
}

@observer
export class DuiPanelFrame extends React.Component<Props> {
  private panelBodyRef = React.createRef<HTMLDivElement>();

  public render() {
    const { panel, duiState, renderTabBody } = this.props;

    // Get the id of the selected tab to render in the panel body
    const tabId = panel.selectedTab?.id;

    return (
      <div className={'dui-panel-frame'} onClick={() => duiState.selectPanel(panel.id)}>
        <div className={'panel-frame-navbar'}>
          <div className={'navbar-tab-list'}>
            {panel.tabs.map((tab) => this.renderPanelTab(tab))}
          </div>

          <div className={'navbar-options'}>{this.renderPanelOptions()}</div>
        </div>

        <div
          ref={this.panelBodyRef}
          className={'panel-frame-body'}
          onDragOver={this.onDragOverPanel}
          onDragLeave={this.onDragOverLeavePanel}
          onDrop={this.onDrop}
        >
          {tabId !== undefined ? (
            <div className={'tab-body-wrapper'}>{renderTabBody(tabId)}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }

  private renderPanelTab(tab: DuiPanelTab) {
    const { panel, duiState } = this.props;

    const tabSelectedClass = panel.isSelected(tab) ? 'selected' : '';

    return (
      <div
        key={`panel-tab-${tab.id}`}
        id={tab.id}
        className={'panel-tab ' + tabSelectedClass}
        draggable={'true'}
        onDragStart={this.onDragStartTab}
        onDragEnd={this.onDragEndTab}
        onClick={() => panel.selectTab(tab)}
      >
        {tab.label}
        <Icon
          className={'tab-delete'}
          icon={'small-cross'}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            duiState.closeTab(tab.id, panel);
          }}
        />
      </div>
    );
  }

  private renderPanelOptions() {
    const { containerId, panel, duiState, panelMenuItems } = this.props;

    return (
      <Popover2
        position={Position.BOTTOM}
        content={
          <Menu>
            {panelMenuItems && (
              <>
                {panelMenuItems(panel.id)}
                <Divider />
              </>
            )}

            <MenuItem
              text={'Add panel right'}
              icon={'add-column-right'}
              onClick={() => duiState.splitPanel(containerId, panel.id, DuiPanelContainerFlow.ROW)}
            />
            <MenuItem
              text={'Add panel below'}
              icon={'add-row-bottom'}
              onClick={() =>
                duiState.splitPanel(containerId, panel.id, DuiPanelContainerFlow.COLUMN)
              }
            />
            <MenuItem
              text={'Close panel'}
              icon={'delete'}
              onClick={() => duiState.deletePanel(containerId, panel.id)}
            />
          </Menu>
        }
      >
        <Button icon={'more'} small minimal />
      </Popover2>
    );
  }

  private onDragStartTab = (e: React.DragEvent<HTMLDivElement>) => {
    const { panel } = this.props;

    const target = e.target as HTMLDivElement;

    // Set the transfer data to hold tab id and 'from' panel
    const data: TabDragData = {
      tabId: target.id,
      fromPanelId: panel.id,
    };

    e.dataTransfer.setData('text', JSON.stringify(data));
  };

  private onDragEndTab = (_e: React.DragEvent<HTMLDivElement>) => {
    this.panelBodyRef.current?.classList.remove('hover-backdrop');
  };

  private onDragOverPanel = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Show the hover guide backdrop

    this.panelBodyRef.current?.classList.add('hover-backdrop');

    return false;
  };

  private onDragOverLeavePanel = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Due to tabs for this panel being nested, causes flicker otherwise
    if (e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
      return;
    }

    this.panelBodyRef.current.classList.remove('hover-backdrop');
  };

  private onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const { duiState, panel } = this.props;

    this.panelBodyRef.current?.classList.remove('hover-backdrop');

    const data = e.dataTransfer.getData('text').trim();

    if (data) {
      const dragData: TabDragData = JSON.parse(data);
      duiState.moveTab(dragData.tabId, dragData.fromPanelId, panel);

      e.dataTransfer.clearData();
    }
  };
}
