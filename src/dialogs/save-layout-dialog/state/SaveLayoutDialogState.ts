import { action, observable } from 'mobx';

export class SaveLayoutDialogState {
  @observable public layoutName = '';
  @observable public isValid = true;
  private firstValidation = false;

  @action public setName(name: string) {
    this.layoutName = name;

    if (this.firstValidation) {
      this.validate();
    }
  }

  @action public validate() {
    this.firstValidation = true;
    this.isValid = this.layoutName.length > 1;
  }
}
