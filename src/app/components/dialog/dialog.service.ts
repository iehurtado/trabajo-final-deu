import { inject, Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Dialog } from "./dialog";

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly modal = inject(NgbModal);

  async alert({ message, title }: { message: string, title?: string }): Promise<void> {
    const modalRef = this.modal.open(Dialog, {
      backdrop: 'static',
    });

    const component = modalRef.componentInstance as Dialog;
    component.title = title ?? 'Alerta';
    component.message = message;
    component.buttons = [
      { label: 'Aceptar', callback: modal => modal.dismiss(), primary: true },
    ];

    await modalRef.result.catch(() => void(0));
  }

  async confirm({ message, title }: { message: string, title?: string }): Promise<boolean> {
    const modalRef = this.modal.open(Dialog, {
      backdrop: 'static',
    });

    const component = modalRef.componentInstance as Dialog;
    component.title = title ?? 'Confirmar';
    component.message = message;
    component.buttons = [
      { label: 'Cancelar', callback: modal => modal.dismiss() },
      { label: 'Aceptar', callback: modal => modal.close(true), primary: true },
    ];

    return modalRef.result.catch(() => false);
  }
}
