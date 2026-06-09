import { Component, inject } from "@angular/core";
import { Toaster } from "./toaster.service";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-toast-container',
  imports: [NgbToast],
  host: {
    'aria-live': 'polite',
    'aria-atomic': 'true',
  },
  styles: `
    :host {
      position: fixed;
      bottom: 10%;
      right: 5%;
      z-index: 2000;
    }
  `,
  template: `
    @for (toast of toaster.toasts(); track toast) {
      @let opts = toast.options;

      <ngb-toast
        [header]="toast.header" [autohide]="true" [delay]="opts?.delay || 5000"
        (hidden)="toaster.remove(toast)">
        {{ toast.body }}
      </ngb-toast>
    }
  `
})
export class ToastContainer {
  protected readonly toaster = inject(Toaster);
}
