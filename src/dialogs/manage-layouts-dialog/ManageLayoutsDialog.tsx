import './manage-layouts-dialog.scss';

import React from 'react';
import { Button, Card, Classes, Dialog, FormGroup, NonIdealState } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import { DialogType, DialogViewState } from '../state/DialogViewState';
import { EditorStorage } from '../../editor-root/state/EditorStorage';
import { LayoutModel } from '../../dockable-ui/model/PanelLayoutModel';

interface Props {
  dialogViewState: DialogViewState;
  editorStorage: EditorStorage;
}

@observer
export class ManageLayoutsDialog extends React.Component<Props> {
  public render() {
    const { dialogViewState } = this.props;

    return (
      <Dialog
        isOpen={dialogViewState.activeDialog === DialogType.MANAGE_LAYOUTS}
        onClose={this.onClose}
        title={'Manage layouts'}
      >
        <div className={'manage-layouts-dialog ' + Classes.DIALOG_BODY}>
          <FormGroup className={'layouts-list'} label={'Saved layouts'}>
            <Card>{this.renderLayouts()}</Card>
          </FormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text={'Close'} onClick={this.onClose} />
          </div>
        </div>
      </Dialog>
    );
  }

  private onClose = () => {
    this.props.dialogViewState.hideDialog();
  };

  private renderLayouts() {
    const { editorStorage } = this.props;

    if (!editorStorage.userLayouts.length) {
      return (
        <NonIdealState
          icon={'clean'}
          title={'No saved layouts'}
          description={'You have no saved layouts!'}
        />
      );
    }

    return editorStorage.userLayouts.map((layout: LayoutModel) => (
      <div key={`layout-item-${layout.id}`} className={'layout-item'}>
        {layout.name}
        <Button
          className={'actions'}
          icon={'trash'}
          minimal
          outlined
          small
          onClick={() => editorStorage.deleteLayout(layout.id)}
        />
      </div>
    ));
  }
}
