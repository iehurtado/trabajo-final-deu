import { Component, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PuntosInteresForm } from "../puntos-interes-form/puntos-interes-form";
import { PuntoInteres, PuntosInteresService } from '../puntos-interes.service';

@Component({
  selector: 'app-puntos-interes-create',
  imports: [ReactiveFormsModule, PuntosInteresForm],
  template: `
  <div class="container-fluid">
    <h1>Nuevo Punto de Interés</h1>
    <app-puntos-interes-form (guardado)="onSubmit($event)"/>
  </div>`,
})
export class PuntosInteresCreate {
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
