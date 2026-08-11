import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { Toaster } from '@common/ui/toaster/toaster.service';
import { AuthService } from '@features/auth/auth.service';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

type LoginDialogState = {
  status: 'waiting'|'submitting'|'error'
}

@Injectable({ providedIn: 'root' })
export class LoginDialogService {
  private readonly modal = inject(NgbModal);

  async show() {
    const modalRef = this.modal.open(LoginDialog, {
      backdrop: 'static',
    });

    return modalRef.result.catch(() => false);
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
  private readonly toaster = inject(Toaster);

  protected readonly error = signal<string|null>(null);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  }, { updateOn: 'submit' });

  protected readonly email = this.form.controls.email;
  protected readonly password = this.form.controls.password;

  async continuar() {
    this.error.set(null);

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.submitting.set(true);
      this.form.disable();
      const value = this.form.getRawValue();
      await this.auth.login({ email: value.email!, password: value.password! });
      const message = 'Se ha iniciado la sesión correctamente';
      this.toaster.show('Iniciar Sesión', message, { class: 'text-bg-success' });
      this.modal.close(true);
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        this.error.set(e.error.message);
        return;
      }

      throw e;
    } finally {
      this.submitting.set(false);
      this.form.enable();
    }
  }
}
