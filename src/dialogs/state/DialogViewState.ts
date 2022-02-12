import { action, observable } from 'mobx';

export enum DialogType {
  SAVE_LAYOUT = 'save-layout',
  MANAGE_LAYOUTS = 'manage-layouts',
}

export class DialogViewState {
  @observable.ref public activeDialog?: DialogType;

  @action public showDialog(dialog: DialogType) {
    this.activeDialog = dialog;
  }

  @action public hideDialog = () => {
    this.activeDialog = undefined;
  };
}
