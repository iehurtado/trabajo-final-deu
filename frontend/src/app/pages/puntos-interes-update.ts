import { Component, inject, input, resource, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PuntosInteresForm } from "../components/puntos-interes-form/puntos-interes-form";
import { PuntoInteres, PuntosInteresService } from '../puntos-interes.service';
import { ReportsUnsaved } from '../util';
import { firstValueFrom } from 'rxjs';
import { Toaster } from '../components/toaster/toaster.service';

@Component({
  selector: 'app-puntos-interes-update',
  imports: [ReactiveFormsModule, PuntosInteresForm],
  template: `
    <main class="container-fluid">
      <h1>Editar Punto de Interés #{{puntoId()}}</h1>
      @if (punto.isLoading()) {
        <div class="alert alert-light">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Cargando...
        </div>
      }
      @if (punto.error(); as e) {
        <div class="alert alert-danger">
          <strong>Error al cargar el punto de interés</strong>
          <p>{{e.message}}</p>
        </div>
      }
      @if (punto.hasValue() && punto.value(); as punto) {
        <app-puntos-interes-form [initialData]="punto"
          [backLink]="['/puntos', punto.id]"
          (guardado)="onSubmit($event)"/>
      }
    </main>
  `,
})
export class PuntosInteresUpdate implements ReportsUnsaved {
  private readonly puntosService = inject(PuntosInteresService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  private readonly form = viewChild.required(PuntosInteresForm);

  readonly puntoId = input.required<number>({alias: 'id'});
  readonly punto = resource({
    params: () => ({ puntoId: this.puntoId() }),
    loader: async ({ params }) => {
      return firstValueFrom(
        this.puntosService.getPuntoInteresById(params.puntoId)
      );
    }
  });

  async onSubmit(data: Omit<PuntoInteres, 'id'>): Promise<void> {
    const id = this.puntoId();

    try {
      await firstValueFrom(this.puntosService.updatePuntoInteres(id, data));
      this.toaster.show('Editar Punto de Interés', 'Se actualizó exitosamente el punto de interés');
      this.form().notifySubmissionCompleted();
      await this.router.navigate(['/puntos', id]);
    } catch (e: unknown) {
      this.toaster.show('Editar Punto de Interés', 'Ha ocurrido un error al actualizar el punto de interés');
      this.form().notifySubmissionCompleted();
      throw e;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form()?.hasUnsavedChanges() ?? false;
  }
}
