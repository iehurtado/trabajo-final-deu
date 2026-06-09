import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserForm } from "../components/user-form/user-form";
import { User, UserService } from '../user.service';
import { ReportsUnsaved } from '../util';
import { firstValueFrom } from 'rxjs';
import { Toaster } from '../components/toaster/toaster.service';

@Component({
  selector: 'app-users-create',
  imports: [UserForm],
  template: `
    <main class="container-fluid">
      <h1>Nuevo Usuario</h1>
      <app-user-form [backLink]="['/users']" (guardado)="onSubmit($event)"/>
    </main>
  `,
})
export class UsersCreate implements ReportsUnsaved {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  private readonly form = viewChild.required(UserForm);

  async onSubmit(data: Partial<User>) {
    try {
      const user = await firstValueFrom(
        this.userService.addUser({
          email: data.email!,
          fullname: data.fullname!,
          password: data.password!,
          roles: data.roles?.map(r => r.id) ?? [],
        })
      );

      this.toaster.show('Nuevo Usuario', 'Se creó exitosamente el usuario');
      this.form().notifySubmissionCompleted();
      await this.router.navigate(['/users', user.id]);
    } catch (e: unknown) {
      this.toaster.show('Nuevo Usuario', 'Ha ocurrido un error al crear el usuario');
      this.form().notifySubmissionCompleted();
      throw e;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
