import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { MapComponent, MarkerComponent } from '../../components/map/map';
import { PuntoInteres } from '../../puntos-interes.service';
import { PuntoInteresIcon } from '../../components/map/util';
import { PuntoInteres, PuntosInteresService } from '../../puntos-interes.service';

@Component({
  selector: 'app-puntos-interes-detail',
  imports: [MapComponent, FixedFooter, RouterLink, MarkerComponent],
  templateUrl: './puntos-interes-detail.html',
  styleUrl: './puntos-interes-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuntosInteresDetail {
  protected readonly faPencilAlt = faPencilAlt;

  private readonly puntosInteresService = inject(PuntosInteresService);

  readonly puntoId = input.required<number>({alias: 'id'});

  protected readonly punto = resource({
    params: () => ({ puntoId: this.puntoId() }),
    loader: async ({ params }) => {
      const punto = await firstValueFrom(
        this.puntosInteresService.getPuntoInteresById(params.puntoId)
      );

      if (!punto) {
        throw new Error('Punto de interés no encontrado');
      }

      return punto;
    },
  });

  markerOptions(punto: PuntoInteres): L.MarkerOptions {
    return { title: `Punto de Interés ${punto.nombre}`, icon: PuntoInteresIcon };
  }
}

