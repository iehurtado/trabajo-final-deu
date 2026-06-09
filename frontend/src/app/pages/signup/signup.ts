import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { equals } from '../../validators';
import { AuthService } from '../../../api';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Toaster } from '../../components/toaster/toaster.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authController = inject(AuthService);
  private readonly toaster = inject(Toaster);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    fullname: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_repeat: [''],
  }, { validators: [equals('password', 'password_repeat')]});

  protected readonly email = this.form.controls['email'];
  protected readonly fullname = this.form.controls['fullname'];
  protected readonly password = this.form.controls['password'];
  protected readonly password_repeat = this.form.controls['password_repeat'];

  protected readonly submitting = signal(false);

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
      this.submitting.set(true);
      const value = this.form.getRawValue();
      await firstValueFrom(this.authController.signup(value));
      const message = 'La cuenta se ha creado exitosamente. Utilice su correo y contraseña para iniciar sesión.';
      this.toaster.show('Crear Cuenta', message);
      await this.router.navigate(['/']);
    } finally {
      this.submitting.set(false);
    }
  }
}
