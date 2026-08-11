import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { Paginator } from "@common/ui/paginator/paginator";
import { UserService } from '../user.service';
import { getUserFriendlyErrorMessage } from '@common/util';
import { DatePipe } from '@angular/common';

const perPage = 10;

@Component({
  selector: 'app-users-list',
  imports: [RouterLink, FaIconComponent, Paginator, DatePipe],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  protected faEye = faEye;
  protected readonly getUserFriendlyErrorMessage = getUserFriendlyErrorMessage;

  private userService = inject(UserService);

  protected readonly page = signal(1);
  protected readonly users = resource({
    params: () => ({ page: this.page() }),
    loader: ({params}) => firstValueFrom(this.userService.getUsers(params.page, perPage)),
  });

  protected readonly unauthorized = computed(() => {
    const error = this.users.error();
    return error instanceof HttpErrorResponse && error.status == 401;
  });

}
