import { Component, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UnauthorizedError } from '../../auth.service';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, map, startWith } from 'rxjs';
import { RouterLink } from "@angular/router";

type LoginDialogState = {
  status: 'waiting'|'submitting'|'error'
}

@Injectable({ providedIn: 'root' })
export class LoginDialogService {
  private readonly modal = inject(NgbModal);

  show() {
    this.modal.open(LoginDialog, {
      backdrop: 'static',
    });
  }
}

@Component({
  selector: 'app-login-dialog',
  imports: [NgbModalModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
})
export class LoginDialog {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  protected readonly modal = inject(NgbActiveModal);

  protected readonly invalidCredentials = signal(false);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  }, { updateOn: 'submit' });

  protected readonly email = this.form.controls.email;
  protected readonly password = this.form.controls.password;

  async continuar() {
    this.invalidCredentials.set(false);

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.submitting.set(true);
      this.form.disable();
      const value = this.form.getRawValue();
      await this.auth.login({ email: value.email!, password: value.password! });
      this.modal.close();
    } catch (e: unknown) {
      if (e instanceof UnauthorizedError) {
        this.invalidCredentials.set(true);
        return;
      }

      throw e;
    } finally {
      this.submitting.set(false);
      this.form.enable();
    }
  }
}
