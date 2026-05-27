import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { PuntoInteres, PuntosInteresService } from '../../puntos-interes.service';
import { Paginator } from "../../components/paginator/paginator";

type PuntosInteresPaginator = {
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
  imports: [AsyncPipe, RouterLink, FixedFooter, FaIconComponent, Paginator],
  templateUrl: './puntos-interes-list.html',
  styleUrl: './puntos-interes-list.scss',
})
export class PuntosInteresList {
  protected readonly faEye = faEye;
  private puntosService = inject(PuntosInteresService);

  protected readonly page$ = new BehaviorSubject(1);

  protected readonly puntos$: Observable<PuntosInteresPaginator> = this.page$.pipe(
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
}
