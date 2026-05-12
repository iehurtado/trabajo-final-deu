import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Balneario } from '../balnearios.service';
import { FixedFooter } from "../fixed-footer/fixed-footer";
import { MapComponent } from '../map/map';
import { PuntoMapa } from '../map/types';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-balnearios-detail',
  imports: [MapComponent, FixedFooter, RouterLink, FaIconComponent],
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
