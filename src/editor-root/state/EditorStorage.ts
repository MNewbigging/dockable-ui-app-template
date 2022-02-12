import { action, observable } from 'mobx';

import { LayoutModel } from '../../dockable-ui/model/PanelLayoutModel';
import { toastManager } from '../../utils/ToastManager';

export class EditorStorage {
  public standardLayouts: LayoutModel[] = [];
  @observable.ref public userLayouts: LayoutModel[] = [];
  private readonly layoutsKey = 'LAYOUTS';

  constructor() {
    this.loadStandardLayouts();
    this.loadUserLayouts();
  }

  public getInitialLayout() {
    // Later, save the user's last used layout in local storage and load that when they reopen the editor
    // for now, just give the first standard layout
    return this.standardLayouts[0];
  }

  public loadStandardLayouts() {
    const standardLayout =
      '{"rootContainerId":"OSPO","containers":[{"id":"OSPO","parentId":"","flow":"row","children":[{"id":"qrMy","basis":70},{"id":"fACT","basis":30}]}],"panels":[{"id":"qrMy","tabs":[{"id":"SRlJ","label":"Page editor","type":"Page editor"},{"id":"Qse6","label":"Story graph","type":"Story graph"}]},{"id":"fACT","tabs":[{"id":"uv6d","label":"Page inspector","type":"Page inspector"}]}],"name":"Standard layout"}';

    const stdLayout: LayoutModel = JSON.parse(standardLayout);

    this.standardLayouts.push(stdLayout);
  }

  public loadUserLayouts() {
    // Read all layouts from localStorage into memory
    const layoutsData = localStorage.getItem(this.layoutsKey);
    if (!layoutsData) {
      return;
    }

    this.userLayouts = JSON.parse(layoutsData);
  }

  public saveUserLayout(layout: LayoutModel) {
    // Add the layout to array in memory
    this.userLayouts = [...this.userLayouts, layout];

    // Overwrite all layouts in localStorage with those in memory
    this.saveUserLayouts();
  }

  @action public deleteLayout(id: string) {
    const layoutName = this.userLayouts.find((layout) => layout.id === id).name;

    // Delete the layout in memory
    this.userLayouts = this.userLayouts.filter((layout) => layout.id !== id);

    // Then overwrite local storage with new layouts array
    this.saveUserLayouts();

    toastManager.successToast('Deleted layout ' + layoutName);
  }

  private saveUserLayouts() {
    localStorage.setItem(this.layoutsKey, JSON.stringify(this.userLayouts));
  }
}
