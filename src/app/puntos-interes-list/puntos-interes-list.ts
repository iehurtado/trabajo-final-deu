import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PuntosInteresService } from '../puntos-interes.service';

@Component({
  selector: 'app-puntos-interes-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './puntos-interes-list.html',
  styleUrl: './puntos-interes-list.scss',
})
export class PuntosInteresList {
  private puntosService = inject(PuntosInteresService);

  protected readonly puntos$ = this.puntosService.getPuntosInteres();
}
