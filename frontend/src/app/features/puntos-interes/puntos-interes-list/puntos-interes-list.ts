import { Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { Paginator } from "@common/ui/paginator/paginator";
import { getUserFriendlyErrorMessage } from '@common/util';
import { PuntosInteresService } from '../puntos-interes.service';
import { DatePipe } from '@angular/common';

const perPage = 10;

@Component({
  selector: 'app-puntos-interes-list',
  imports: [RouterLink, FaIconComponent, Paginator, DatePipe],
  templateUrl: './puntos-interes-list.html',
  styleUrl: './puntos-interes-list.scss',
})
export class PuntosInteresList {
  protected readonly faEye = faEye;
  protected readonly getUserFriendlyErrorMessage = getUserFriendlyErrorMessage;
  private puntosService = inject(PuntosInteresService);

  protected readonly page = signal(1);

  protected readonly puntos = resource({
    params: () => ({ page: this.page() }),
    loader: ({ params }) => firstValueFrom(
      this.puntosService.getPuntosInteres(params.page, perPage)
    ),
  });
}
