import { Component, inject, input, resource, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Balneario, BalneariosService } from '../balnearios.service';
import { BalneariosForm } from "../components/balnearios-form/balnearios-form";
import { ReportsUnsaved } from '../util';
import { Toaster } from '../components/toaster/toaster.service';

@Component({
  selector: 'app-balnearios-update',
  imports: [BalneariosForm],
  template: `
    <main class="container-fluid">
      <h1>Editar Balneario #{{ balnearioId() }}</h1>
      @if (balneario.isLoading()) {
        <div class="alert alert-light">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Cargando...
        </div>
      }
      @if (balneario.error(); as e) {
        <div class="alert alert-danger">
          <strong>Error al cargar el balneario</strong>
          <p>{{ e.message }}</p>
        </div>
      }
      @if (balneario.hasValue() && balneario.value(); as balneario) {
        <app-balnearios-form [backLink]="['/balnearios', balneario.id]"
          [initialData]="balneario" (guardado)="onSubmit($event)"/>
      }
    </main>
  `,
})
export class BalneariosUpdate implements ReportsUnsaved {
  private readonly balneariosService = inject(BalneariosService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  private readonly form = viewChild.required(BalneariosForm);

  protected readonly balnearioId = input.required<number>({ alias: 'id' });
  protected readonly balneario = resource({
    params: () => ({ balnearioId: this.balnearioId() }),
    loader: async ({ params }) => {
      const balneario = await firstValueFrom(
        this.balneariosService.getBalnearioById(params.balnearioId)
      );

      if (!balneario) {
        throw new Error('Balneario no encontrado');
      }

      return balneario;
    },
  });

  async onSubmit(data: Omit<Balneario, 'id'>): Promise<void> {
    const id = this.balnearioId();

    try {
      await firstValueFrom(this.balneariosService.updateBalneario(id, data));
      this.toaster.show('Editar Balneario', 'Se actualizó exitosamente el balneario');
      this.form().notifySubmissionCompleted();
      await this.router.navigate(['/balnearios', id]);
    } catch (e: unknown) {
      this.toaster.show('Editar Balneario', 'Ha ocurrido un error al actualizar el balneario');
      this.form().notifySubmissionCompleted();
      throw e;
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}

