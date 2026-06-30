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

      <ngb-toast [class]="opts?.class" [autohide]="true"
        [delay]="opts?.delay || 5000" (hidden)="toaster.remove(toast)">

        @if (toast.header) {
          <header class="d-flex justify-content-between align-items-center">
            <h5 class="d-flex justify-content-between align-items-center">{{ toast.header }}</h5>
            <button type="button" class="btn-close" title="Cerrar"></button>
          </header>
        }

        {{ toast.body }}

        @if (!toast.header) {
          <button type="button" class="btn-close float-end" title="Cerrar"></button>
        }

      </ngb-toast>
    }
  `
})
export class ToastContainer {
  protected readonly toaster = inject(Toaster);

}
