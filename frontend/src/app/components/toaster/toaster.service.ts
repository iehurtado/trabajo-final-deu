import { Injectable, signal } from "@angular/core";

export interface ToastInfo {
  header: string;
  body: string;
  options?: {
    delay?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class Toaster {
  private readonly _toasts = signal<ToastInfo[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(header: string, body: string, options?: { delay?: number }) {
    this._toasts.update(toasts => [ ...toasts, { header, body, options } ]);
  }

  remove(toast: ToastInfo) {
    this._toasts.update(toasts => toasts.filter(t => t !== toast));
  }
}
