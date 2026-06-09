import { Component, inject, input, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PuntosInteresForm } from "../components/puntos-interes-form/puntos-interes-form";
import { PuntoInteres, PuntosInteresService } from '../puntos-interes.service';
import { ReportsUnsaved } from '../util';

@Component({
  selector: 'app-puntos-interes-update',
  imports: [ReactiveFormsModule, PuntosInteresForm],
  template: `
    @let punto = this.punto();

    <main class="container-fluid">
      <h1>Editar Punto de Interés #{{punto.id}}</h1>
      <app-puntos-interes-form [initialData]="punto"
        [backLink]="['/puntos', punto.id]"
        (guardado)="onSubmit($event)"/>
    </main>
  `,
})
export class PuntosInteresUpdate implements ReportsUnsaved {
  private readonly puntosService = inject(PuntosInteresService);
  private readonly router = inject(Router);

  private readonly form = viewChild(PuntosInteresForm);

  readonly punto = input.required<PuntoInteres>();

  onSubmit(data: Omit<PuntoInteres, 'id'>): void {
    const id = this.punto()?.id;
    if (!id) return;

    this.puntosService.updatePuntoInteres(id, data).subscribe(() => {
      this.form()?.notifySubmissionCompleted();
      this.router.navigate(['/puntos', id]);
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form()?.hasUnsavedChanges() ?? false;
  }
}
