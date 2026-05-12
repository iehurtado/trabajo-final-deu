import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Balneario } from '../../balnearios.service';
import { FixedFooter } from '../../components/fixed-footer/fixed-footer';
import { MapComponent } from '../../components/map/map';
import { PuntoMapa } from '../../components/map/types';

@Component({
  selector: 'app-balnearios-detail',
  imports: [MapComponent, FixedFooter, RouterLink],
  templateUrl: './balnearios-detail.html',
  styleUrl: './balnearios-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalneariosDetail {
  protected readonly faPencilAlt = faPencilAlt;

  @Input() balneario!: Balneario;

  protected get mapPuntos(): PuntoMapa[] {
    return [PuntoMapa.fromBalneario(this.balneario)];
  }

  protected get mapCenter(): [number, number] {
    return [this.balneario.latitud, this.balneario.longitud];
  }
}
