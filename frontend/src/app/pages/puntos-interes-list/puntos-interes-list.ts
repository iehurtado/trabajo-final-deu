import { Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { Paginator } from "../../components/paginator/paginator";
import { PuntosInteresService } from '../../puntos-interes.service';

const perPage = 10;

@Component({
  selector: 'app-puntos-interes-list',
  imports: [RouterLink, FixedFooter, FaIconComponent, Paginator],
  templateUrl: './puntos-interes-list.html',
  styleUrl: './puntos-interes-list.scss',
})
export class PuntosInteresList {
  protected readonly faEye = faEye;
  private puntosService = inject(PuntosInteresService);

  protected readonly page = signal(1);

  protected readonly puntos = resource({
    params: () => ({ page: this.page() }),
    loader: ({ params }) => firstValueFrom(
      this.puntosService.getPuntosInteres(params.page, perPage)
    ),
  });
}
