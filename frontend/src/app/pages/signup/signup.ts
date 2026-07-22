import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Toaster } from '../../components/toaster/toaster.service';
import { equals, createUserEmailValidator } from '../../validators';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toaster = inject(Toaster);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email], [createUserEmailValidator(this.authService)]],
    fullname: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_repeat: [''],
  }, { validators: [equals('password', 'password_repeat')]});

  protected readonly email = this.form.controls['email'];
  protected readonly fullname = this.form.controls['fullname'];
  protected readonly password = this.form.controls['password'];
  protected readonly password_repeat = this.form.controls['password_repeat'];

  protected readonly submitting = signal(false);
  protected readonly error = signal<string|null>(null)

  constructor() {
    effect(() => {
      if (this.submitting()) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  async crearCuenta() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.error.set(null);
      this.submitting.set(true);
      const value = this.form.getRawValue();
      await this.authService.signup(value);
      const message = 'La cuenta se ha creado exitosamente. Utilice su correo y contraseña para iniciar sesión.';
      this.toaster.show('Crear Cuenta', message, { class: 'text-bg-success' });
      await this.router.navigate(['/']);
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        this.error.set(e.error.message);
        return;
      }

      throw e;
    } finally {
      this.submitting.set(false);
    }
  }
}
