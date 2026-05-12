import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { BalneariosService } from '../../balnearios.service';
import { MapComponent } from '../../components/map/map';
import { PuntoMapa } from '../../components/map/types';
import { PuntosInteresService } from '../../puntos-interes.service';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MapComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private puntosService = inject(PuntosInteresService);
  private balneariosService = inject(BalneariosService);

  private puntos$ = this.puntosService.getPuntosInteres().pipe(
    map(puntos => puntos.map(x => PuntoMapa.fromPuntoInteres(x)))
  );

  private balnearios$ = this.balneariosService.getBalnearios().pipe(
    map(balnearios => balnearios.map(x => PuntoMapa.fromBalneario(x)))
  );

  protected markers$ = combineLatest([this.puntos$, this.balnearios$]).pipe(
    map(([puntos, balnearios]) => [...puntos, ...balnearios])
  );
}




