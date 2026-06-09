import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, UrlTree } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Rol, User, UserService } from '../../user.service';
import { equals } from "../../validators";
import { FixedFooter } from "../fixed-footer/fixed-footer";

const PASSWD_VALIDATORS = [Validators.required, Validators.minLength(6)];
const PASSWD_R_VALIDATORS = [Validators.required];

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FixedFooter, NgSelectModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  protected readonly guardando = signal(false);

  protected readonly availableRoles$ = this.userService.getRoles();

  readonly backLink = input<string | readonly any[] | UrlTree>();
  readonly initialData = input<User>();
  protected readonly guardado = output<Partial<User>>();

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', PASSWD_VALIDATORS],
    password_repeat: ['', Validators.required],
    roles: [[] as Rol[]],
  }, { validators: [equals('password', 'password_repeat')] });

  protected readonly email = this.form.controls.email;
  protected readonly fullname = this.form.controls.fullname;
  protected readonly password = this.form.controls.password;
  protected readonly passwordRepeat = this.form.controls.password_repeat;

  protected readonly roles = this.form.controls.roles;

  protected readonly compareUsingId = <T extends { id: number }>(a?: T, b?: T) => a?.id === b?.id;

  constructor() {
    effect(() => {
      const data = this.initialData();

      if (data) {
        this.form.patchValue({
          email: data.email,
          fullname: data.fullname,
          password: '',
          roles: data.roles,
        });

        // Make password optional when editing
        this.password.setValidators([]);
        this.passwordRepeat.setValidators([]);
        this.form.updateValueAndValidity();
      } else {
        this.password.setValidators(PASSWD_VALIDATORS);
        this.passwordRepeat.setValidators(PASSWD_R_VALIDATORS);
        this.form.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    //
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.disable();
    this.guardando.set(true);
    const formValue = this.form.getRawValue();

    this.guardado.emit({
      email: formValue.email!,
      fullname: formValue.fullname!,
      password: formValue.password || undefined,
      roles: formValue.roles!,
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  notifySubmissionCompleted(): void {
    this.form.enable();
    this.form.markAsPristine();
    this.guardando.set(false);
  }
}
