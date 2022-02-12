import './app.scss';

import React from 'react';
import { Button, MenuItem, NonIdealState } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { DockableUI } from './dockable-ui/components/DockableUI';
import { EditorNavbar } from './editor-root/components/EditorNavbar';
import { EditorState } from './editor-root/state/EditorState';
import { ManageLayoutsDialog } from './dialogs/manage-layouts-dialog/ManageLayoutsDialog';
import { PanelTabType } from './editor-root/state/PanelTabTypes';
import { SaveLayoutDialog } from './dialogs/save-layout-dialog/components/SaveLayoutDialog';
import { TabBodyRenderer } from './editor-root/components/TabBodyRenderer';

@observer
export class App extends React.Component {
  private editorState = new EditorState();

  public render() {
    return (
      <div className={'app'}>
        {/* Dialogs */}
        <SaveLayoutDialog
          dialogViewState={this.editorState.dialogViewState}
          saveLayout={this.editorState.saveLayout}
        />
        <ManageLayoutsDialog
          dialogViewState={this.editorState.dialogViewState}
          editorStorage={this.editorState.editorStorage}
        />

        <div className={'navbar-area'}>
          <EditorNavbar editorState={this.editorState} />
        </div>

        <div className={'main-area'}>
          <DockableUI
            duiState={this.editorState.dockableUiState}
            renderTabBody={this.renderTabBody}
            renderPanelMenuItems={this.renderPanelMenuItems}
            renderNoPanels={this.renderNoPanels}
          />
        </div>
      </div>
    );
  }

  private renderTabBody = (tabId: string) => {
    // Get the tab to render
    const tab = this.editorState.getTab(tabId);
    if (!tab) {
      return;
    }

    const tabBody = TabBodyRenderer.makeTabRenderer(tab);

    return <>{tabBody}</>;
  };

  private renderPanelMenuItems = (panelId: string) => {
    return (
      <>
        <MenuItem
          icon={'tank'}
          text={'Dummy tab 1'}
          onClick={() => this.editorState.addTab(PanelTabType.DUMMY_ONE, panelId)}
        />
      </>
    );
  };

  private renderNoPanels = () => {
    const { dockableUiState } = this.editorState;

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
