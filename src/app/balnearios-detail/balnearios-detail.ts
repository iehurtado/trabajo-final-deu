import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Balneario } from '../balnearios.service';
import { MapComponent } from '../map/map';
import { PuntoInteres } from '../puntos-interes.service';
import { FixedFooter } from "../fixed-footer/fixed-footer";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-balnearios-detail',
  imports: [MapComponent, FixedFooter, RouterLink],
  templateUrl: './balnearios-detail.html',
  styleUrl: './balnearios-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalneariosDetail {
  @Input() balneario!: Balneario;

  protected get mapPuntos(): PuntoInteres[] {
    // Adaptamos el balneario para el componente de mapa que espera PuntoInteres
    return [{
      id: this.balneario.id,
      nombre: this.balneario.nombre,
      latitud: this.balneario.latitud,
      longitud: this.balneario.longitud,
      categoria: 'Balneario',
      subcategoria: this.balneario.estadoAgua
    }];
  }

  protected get mapCenter(): [number, number] {
    return [this.balneario.latitud, this.balneario.longitud];
  }
}
