import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { Balneario, BalneariosService } from '../../balnearios.service';
import { FixedFooter } from "../../components/fixed-footer/fixed-footer";
import { Paginator } from "../../components/paginator/paginator";

type BalneariosPaginator = {
  data: Balneario[];
  paginatorInfo: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  }
};

const perPage = 10;

@Component({
  selector: 'app-balnearios-list',
  imports: [AsyncPipe, RouterLink, FixedFooter, FaIconComponent, Paginator],
  templateUrl: './balnearios-list.html',
  styleUrl: './balnearios-list.scss',
})
export class BalneariosList {
  protected faEye = faEye;

  private balneariosService = inject(BalneariosService);

  protected readonly page$ = new BehaviorSubject(1);

  protected readonly balnearios$: Observable<BalneariosPaginator> = this.page$.pipe(
    switchMap(page => this.balneariosService.getBalnearios().pipe(
      map(data => ({
        data: data.slice((page - 1) * perPage, page * perPage),
        paginatorInfo: {
          currentPage: page,
          perPage,
          total: data.length,
          totalPages: Math.ceil(data.length / perPage)
        }
      }))
    ))
  );
}
