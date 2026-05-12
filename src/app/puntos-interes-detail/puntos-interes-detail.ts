import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PuntoInteres } from '../puntos-interes.service';
import { MapComponent } from '../map/map';
import { FixedFooter } from "../fixed-footer/fixed-footer";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-puntos-interes-detail',
  imports: [MapComponent, FixedFooter, RouterLink],
  templateUrl: './puntos-interes-detail.html',
  styleUrl: './puntos-interes-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuntosInteresDetail {
  @Input() punto!: PuntoInteres;

  protected get mapPuntos(): PuntoInteres[] {
    return [this.punto];
  }

  protected get mapCenter(): [number, number] {
    return [this.punto.latitud, this.punto.longitud];
  }
}

