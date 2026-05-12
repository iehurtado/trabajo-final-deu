import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { PuntoInteres, PuntosInteresService } from '../../puntos-interes.service';

type Paginator = {
  data: PuntoInteres[];
  paginatorInfo: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  }
};

const perPage = 10;

@Component({
  selector: 'app-puntos-interes-list',
  imports: [AsyncPipe, RouterLink, FixedFooter, FaIconComponent],
  templateUrl: './puntos-interes-list.html',
  styleUrl: './puntos-interes-list.scss',
})
export class PuntosInteresList {
  protected readonly faEye = faEye;
  private puntosService = inject(PuntosInteresService);

  protected readonly page$ = new BehaviorSubject(1);

  protected readonly puntos$: Observable<Paginator> = this.page$.pipe(
    switchMap(page => this.puntosService.getPuntosInteres().pipe(
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
