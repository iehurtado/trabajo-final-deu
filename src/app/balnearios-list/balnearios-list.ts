import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Balneario, BalneariosService } from '../balnearios.service';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { FixedFooter } from "../fixed-footer/fixed-footer";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

type Paginator = {
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
  imports: [AsyncPipe, RouterLink, FixedFooter, FaIconComponent],
  templateUrl: './balnearios-list.html',
  styleUrl: './balnearios-list.scss',
})
export class BalneariosList {
  protected faEye = faEye;

  private balneariosService = inject(BalneariosService);

  protected readonly page$ = new BehaviorSubject(1);

  protected readonly balnearios$: Observable<Paginator> = this.page$.pipe(
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

  protected range(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  protected previousPage() {
    this.page$.next(Math.max(this.page$.getValue() - 1, 1));
  }

  protected nextPage(totalPages: number) {
    this.page$.next(Math.min(this.page$.getValue() + 1, totalPages));
  }
}
