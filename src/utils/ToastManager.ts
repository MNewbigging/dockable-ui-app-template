import { Intent, Position, Toaster } from '@blueprintjs/core';

class ToastManager {
  private toaster = Toaster.create({
    position: Position.TOP,
  });

  public successToast(message: string) {
    this.toaster.show({ message, intent: Intent.SUCCESS });
  }

  public toast(message: string) {
    this.toaster.show({ message });
  }

  public warnToast(message: string) {
    this.toaster.show({ message, intent: Intent.WARNING });
  }

  public errorToast(message: string) {
    this.toaster.show({ message, intent: Intent.DANGER });
  }
}

export const toastManager = new ToastManager();
