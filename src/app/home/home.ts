import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PuntosInteresService } from '../puntos-interes.service';
import { MapComponent } from '../map/map';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MapComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private puntosService = inject(PuntosInteresService);
  protected puntos$ = this.puntosService.getPuntosInteres();
}


