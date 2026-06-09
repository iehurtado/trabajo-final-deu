import { Component, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PuntoInteres, PuntosInteresService } from '../puntos-interes.service';
import { PuntosInteresForm } from '../components/puntos-interes-form/puntos-interes-form';
import { ReportsUnsaved } from '../util';

@Component({
  selector: 'app-puntos-interes-create',
  imports: [ReactiveFormsModule, PuntosInteresForm],
  template: `
  <main class="container-fluid">
    <h1>Nuevo Punto de Interés</h1>
    <app-puntos-interes-form [backLink]="['/puntos']" (guardado)="onSubmit($event)"/>
  </main>`,
})
export class PuntosInteresCreate implements ReportsUnsaved {
  private readonly puntosService = inject(PuntosInteresService);
  private readonly router = inject(Router);

  private readonly form = viewChild.required(PuntosInteresForm);

  protected readonly guardando = signal(false);

  onSubmit(data: Omit<PuntoInteres, 'id'>): void {
    const agregado$ = this.puntosService.addPuntoInteres(data);

    agregado$.subscribe(({ id }) => {
      this.form().notifySubmissionCompleted();
      this.router.navigate(['/puntos', id]);
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
