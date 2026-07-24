import { Component, inject, input, resource, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Toaster } from '../components/toaster/toaster.service';
import { UserForm } from "../components/user-form/user-form";
import { UpdateUserForm, User, UserService } from '../user.service';
import { getUserFriendlyErrorMessage, ReportsUnsaved } from '../util';

@Component({
  selector: 'app-users-update',
  imports: [UserForm, RouterLink],
  template: `
    <main class="container-fluid">
      <h1>Editar Usuario #{{ userId() }}</h1>
      @if (user.isLoading()) {
        <div class="alert alert-light">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Cargando...
        </div>
      }
      @if (user.error(); as e) {
        <div class="alert alert-danger" role="alert">
          <strong>No se pudo cargar el usuario</strong>
          <div>{{ getUserFriendlyErrorMessage(e, 'Usuario') }}</div>
          <br>
          <a role="button" class="btn btn-link" routerLink="/users">Volver</a>
        </div>
      }
      @if (user.hasValue() && user.value(); as user) {
        <app-user-form [initialData]="user" [backLink]="['/users', user.id]" (guardado)="onSubmit($event)"/>
      }
    </main>
  `,
})
export class UsersUpdate implements ReportsUnsaved {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  private readonly form = viewChild(UserForm);
  protected readonly getUserFriendlyErrorMessage = getUserFriendlyErrorMessage;

  protected readonly userId = input.required<number>({ alias: 'id' });
  protected readonly user = resource({
    params: () => ({ userId: this.userId() }),
    loader: async ({ params }) => {
      const user = await firstValueFrom(this.userService.getUserById(params.userId));

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    },
  });

  async onSubmit(data: Partial<User>) {

    const updateData: UpdateUserForm = {
      email: data.email,
      fullname: data.fullname,
      roles: data.roles?.map(r => r.id) ?? [],
    };

    if (data.password) {
      updateData.password = data.password;
    }

    const form = this.form();

    if (!form) throw new Error('Child query failed!');

    try {
      await firstValueFrom(this.userService.updateUser(this.userId(), updateData));

      this.toaster.show('Editar Usuario', 'Se actualizó exitosamente el usuario', { class: 'text-bg-success' });
      form.notifySubmissionCompleted();
      await this.router.navigate(['/users', this.userId()]);
    } catch (e: unknown) {
      form.notifySubmissionCompleted();
      this.toaster.show('Editar Usuario', getUserFriendlyErrorMessage(e, 'Usuario'), { class: 'text-bg-danger' });
      throw e;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form()?.hasUnsavedChanges() ?? false;
  }
}
