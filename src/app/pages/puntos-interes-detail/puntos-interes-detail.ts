import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { MapComponent } from '../../components/map/map';
import { PuntoMapa } from '../../components/map/types';
import { PuntoInteres } from '../../puntos-interes.service';

@Component({
  selector: 'app-puntos-interes-detail',
  imports: [MapComponent, FixedFooter, RouterLink],
  templateUrl: './puntos-interes-detail.html',
  styleUrl: './puntos-interes-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuntosInteresDetail {
  protected readonly faPencilAlt = faPencilAlt;

  @Input() punto!: PuntoInteres;

  protected get mapPuntos(): PuntoMapa[] {
    return [PuntoMapa.fromPuntoInteres(this.punto)];
  }

  protected get mapCenter(): [number, number] {
    return [this.punto.latitud, this.punto.longitud];
  }
}

