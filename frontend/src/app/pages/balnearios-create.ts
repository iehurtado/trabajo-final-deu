import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BalneariosForm } from "../components/balnearios-form/balnearios-form";
import { Balneario, BalneariosService } from '../balnearios.service';
import { ReportsUnsaved } from '../util';
import { firstValueFrom } from 'rxjs';
import { Toaster } from '../components/toaster/toaster.service';

@Component({
  selector: 'app-balnearios-create',
  imports: [BalneariosForm],
  template: `
    <main class="container-fluid">
      <h1>Nuevo Balneario</h1>
      <app-balnearios-form [backLink]="['/balnearios']" (guardado)="onSubmit($event)"/>
    </main>
  `,
})
export class BalneariosCreate implements ReportsUnsaved {
  private readonly balneariosService = inject(BalneariosService);
  private readonly router = inject(Router);
  private readonly toaster = inject(Toaster);

  private readonly form = viewChild.required(BalneariosForm);

  protected readonly guardando = signal(false);

  async onSubmit(data: Omit<Balneario, 'id'>): Promise<void> {
    this.guardando.set(true);
    try {
      const { id } = await firstValueFrom(this.balneariosService.addBalneario(data));
      this.toaster.show('Nuevo Balneario', 'Se agregó exitosamente el balneario');
      this.form().notifySubmissionCompleted();
      await this.router.navigate(['/balnearios', id]);
    } catch (e: unknown) {
      this.toaster.show('Nuevo Balneario', 'Ha ocurrido un error al agregar el balneario');
      this.form().notifySubmissionCompleted();
    } finally {
      this.guardando.set(false);
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
