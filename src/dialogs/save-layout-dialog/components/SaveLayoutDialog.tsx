import React from 'react';
import { Button, Classes, Dialog, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { DialogType, DialogViewState } from '../../state/DialogViewState';
import { SaveLayoutDialogState } from '../state/SaveLayoutDialogState';

interface Props {
  dialogViewState: DialogViewState;
  saveLayout: (name: string) => void;
}

@observer
export class SaveLayoutDialog extends React.Component<Props> {
  @observable private saveLayoutState?: SaveLayoutDialogState;

  public render() {
    const { dialogViewState } = this.props;

    return (
      <Dialog
        isOpen={dialogViewState.activeDialog === DialogType.SAVE_LAYOUT}
        onOpening={this.onOpening}
        onClose={this.onClose}
        onClosed={this.onClosed}
        title={'Save layout'}
      >
        {this.saveLayoutState && (
          <>
            <div className={Classes.DIALOG_BODY}>
              <FormGroup
                label={'Name *'}
                helperText={
                  this.saveLayoutState.isValid ? '' : 'Name must be at least 2 characters'
                }
              >
                <InputGroup
                  intent={this.saveLayoutState.isValid ? undefined : Intent.DANGER}
                  value={this.saveLayoutState.layoutName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.saveLayoutState.setName(e.target.value)
                  }
                />
              </FormGroup>
            </div>

            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button text={'Save'} intent={Intent.PRIMARY} onClick={this.onSaveLayout} />
              </div>
            </div>
          </>
        )}
      </Dialog>
    );
  }

  private onSaveLayout = () => {
    // First, validate the name
    this.saveLayoutState.validate();

    // If still valid, can now save layout
    if (this.saveLayoutState.isValid) {
      this.props.saveLayout(this.saveLayoutState.layoutName);
      this.onClose();
    }
  };

  private onOpening = () => {
    this.saveLayoutState = new SaveLayoutDialogState();
  };

  private onClose = () => {
    this.props.dialogViewState.hideDialog();
  };

  private onClosed = () => {
    this.saveLayoutState = undefined;
  };
}
