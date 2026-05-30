import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { MapComponent, MarkerComponent } from '../../components/map/map';
import { PuntoInteres } from '../../puntos-interes.service';

@Component({
  selector: 'app-puntos-interes-detail',
  imports: [MapComponent, FixedFooter, RouterLink, MarkerComponent],
  templateUrl: './puntos-interes-detail.html',
  styleUrl: './puntos-interes-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuntosInteresDetail {
  protected readonly faPencilAlt = faPencilAlt;

  @Input({ required: true }) punto!: PuntoInteres;

  get markerOptions(): L.MarkerOptions {
    return { title: `Punto de Interés ${this.punto.nombre}` };
  }
}

