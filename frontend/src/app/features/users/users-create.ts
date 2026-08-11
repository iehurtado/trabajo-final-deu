import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserForm } from "./user-form/user-form";
import { User, UserService } from './user.service';
import { getUserFriendlyErrorMessage, ReportsUnsaved } from '@common/util';
import { firstValueFrom } from 'rxjs';
import { Toaster } from '@common/ui/toaster/toaster.service';

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

      this.toaster.show('Nuevo Usuario', 'Se creó exitosamente el usuario', { class: 'text-bg-success' });
      this.form().notifySubmissionCompleted();
      await this.router.navigate(['/users', user.id]);
    } catch (e: unknown) {
      this.toaster.show('Nuevo Usuario', getUserFriendlyErrorMessage(e, 'Usuario'), { class: 'text-bg-danger' });
      this.form().notifySubmissionCompleted();
      throw e;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
