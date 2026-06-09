import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { User, UserService } from '../../user.service';
import { FixedFooter } from "../../components/fixed-footer/fixed-footer";
import { Paginator } from "../../components/paginator/paginator";

type UsersPaginator = {
  data: User[];
  paginatorInfo: {
    currentPage: number;
    perPage: number;
    totalPages: number;
  }
};

const perPage = 10;

@Component({
  selector: 'app-users-list',
  imports: [AsyncPipe, RouterLink, FixedFooter, FaIconComponent, Paginator],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  protected faEye = faEye;

  private userService = inject(UserService);

  protected readonly page$ = new BehaviorSubject(1);

  protected readonly users$: Observable<UsersPaginator> = this.page$.pipe(
    switchMap(page => this.userService.getUsers(page, perPage)),
  );
}
