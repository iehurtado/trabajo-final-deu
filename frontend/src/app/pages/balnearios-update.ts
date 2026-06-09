import { Component, inject, input, viewChild } from '@angular/core';
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
    @if (balneario(); as balneario) {
      <main class="container-fluid">
        <h1>Editar Balneario #{{ balneario.id }}</h1>
        <app-balnearios-form [backLink]="['/balnearios', balneario.id]"
          [initialData]="balneario" (guardado)="onSubmit($event)"/>
      </main>
    }
  `,
})
export class BalneariosUpdate implements ReportsUnsaved {
  private readonly balneariosService = inject(BalneariosService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  private readonly form = viewChild.required(BalneariosForm);

  protected readonly balneario = input.required<Balneario>();

  async onSubmit(data: Omit<Balneario, 'id'>): Promise<void> {
    const id = this.balneario().id;

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

