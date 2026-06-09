import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PuntoInteres, PuntosInteresService } from '../puntos-interes.service';
import { PuntosInteresForm } from '../components/puntos-interes-form/puntos-interes-form';
import { ReportsUnsaved } from '../util';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import { Toaster } from '../components/toaster/toaster.service';

@Component({
  selector: 'app-puntos-interes-create',
  imports: [ReactiveFormsModule, PuntosInteresForm],
  template: `
  <main class="container-fluid">
    <h1>Nuevo Punto de Interés</h1>
    <app-puntos-interes-form [backLink]="backLink()" (guardado)="onSubmit($event)"/>
  </main>`,
})
export class PuntosInteresCreate implements ReportsUnsaved {
  private readonly puntosService = inject(PuntosInteresService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  private readonly auth = inject(AuthService);
  private readonly canViewList = this.auth.can('Administrador');
  private readonly canViewDetail = this.canViewList;
  protected readonly backLink = computed(() => this.canViewList() ? ['/puntos'] : ['/']);

  private readonly form = viewChild.required(PuntosInteresForm);

  protected readonly guardando = signal(false);

  async onSubmit(data: Omit<PuntoInteres, 'id'>): Promise<void> {
    try {
      const { id } = await firstValueFrom(this.puntosService.addPuntoInteres(data));

      this.form().notifySubmissionCompleted();

      const url = this.canViewDetail()
        ? ['/puntos', id]
        : ['/'];
      this.toaster.show('Nuevo Punto de Interés', 'Se agregó exitosamente el punto de interés');
      await this.router.navigate(url);
    } catch (e: unknown) {
      this.toaster.show('Nuevo Punto de Interés', 'Ha ocurrido un error al agregar el punto de interés');
      this.form().notifySubmissionCompleted();
      throw e;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
