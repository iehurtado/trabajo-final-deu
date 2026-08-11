import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

type DialogButton = {
  label: string;
  primary?: boolean;
  callback: (modal: NgbActiveModal) => Promise<void>|void;
}

@Component({
  selector: 'app-dialog',
  imports: [
    NgbModalModule,
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  protected activeModal = inject(NgbActiveModal);

  public title!: string;
  public message!: string;
  public buttons: DialogButton[] = [];
}
