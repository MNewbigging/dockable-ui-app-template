import './navbar.scss';

import React from 'react';
import { Divider, Menu, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { observer } from 'mobx-react';

import { DialogType } from '../../dialogs/state/DialogViewState';
import { EditorState } from '../state/EditorState';

interface Props {
  editorState: EditorState;
}

@observer
export class EditorNavbar extends React.Component<Props> {
  public render() {
    return <div className={'navbar'}>{this.renderLayoutMenu()}</div>;
  }

  private renderLayoutMenu() {
    const { editorState } = this.props;

    // Get standard layout options
    const standardLayoutOptions = editorState.editorStorage.standardLayouts.map((layout, idx) => (
      <MenuItem
        key={`standard-layout-${idx}`}
        text={layout.name}
        onClick={() => editorState.loadLayout(layout)}
      />
    ));

    // Get user layout options
    const userLayoutOptions = editorState.editorStorage.userLayouts.map((layout, idx) => (
      <MenuItem
        key={`user-layout-${idx}`}
        text={layout.name}
        onClick={() => editorState.loadLayout(layout)}
      />
    ));

    return (
      <Popover2
        position={Position.BOTTOM}
        minimal
        className={'menu-root-wrapper'}
        content={
          <Menu>
            {userLayoutOptions.length > 0 && (
              <>
                {userLayoutOptions}
                <Divider />
              </>
            )}

            {standardLayoutOptions.length > 0 && (
              <>
                {standardLayoutOptions}
                <Divider />
              </>
            )}

            <MenuItem
              text={'Save layout'}
              onClick={editorState.startSaveLayout}
              disabled={!editorState.dockableUiState.hasLayout()}
            />
            <MenuItem
              text={'Manage layouts'}
              onClick={() => editorState.dialogViewState.showDialog(DialogType.MANAGE_LAYOUTS)}
            />
          </Menu>
        }
      >
        <div className={'menu-root'}>Layout</div>
      </Popover2>
    );
  }
}
