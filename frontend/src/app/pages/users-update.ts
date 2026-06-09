import { Component, inject, input, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserForm } from "../components/user-form/user-form";
import { UpdateUserForm, User, UserService } from '../user.service';
import { ReportsUnsaved } from '../util';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-users-update',
  imports: [UserForm],
  template: `
    @if (user(); as user) {
      <main class="container-fluid">
        <h1>Editar Usuario #{{ user.id }}</h1>
        <app-user-form [initialData]="user" [backLink]="['/users', user.id]" (guardado)="onSubmit($event)"/>
      </main>
    }
  `,
})
export class UsersUpdate implements ReportsUnsaved {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  private readonly form = viewChild.required(UserForm);

  protected readonly user = input.required<User>();

  async onSubmit(data: Partial<User>) {
    const user = this.user();

    const updateData: UpdateUserForm = {
      email: data.email,
      fullname: data.fullname,
      roles: data.roles?.map(r => r.id) ?? [],
    };

    if (data.password) {
      updateData.password = data.password;
    }

    try {
      await firstValueFrom(this.userService.updateUser(user.id, updateData));

      // if (data.roles && data.roles.length > 0) {
      //   const roleIds = data.roles.map(r => r.id);
      //   await firstValueFrom(this.userService.updateUserRoles(user.id, roleIds));
      // }

      this.form().notifySubmissionCompleted();

      await this.router.navigate(['/users', user.id]);
    } catch (e: unknown) {
      this.form().notifySubmissionCompleted();
      throw e;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
