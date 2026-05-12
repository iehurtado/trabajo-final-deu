import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BalneariosForm } from "../components/balnearios-form/balnearios-form";
import { Balneario, BalneariosService } from '../balnearios.service';

@Component({
  selector: 'app-balnearios-create',
  imports: [BalneariosForm],
  template: `
    <div class="container-fluid">
      <h1>Nuevo Balneario</h1>
      <app-balnearios-form (guardado)="onSubmit($event)"/>
    </div>
  `,
})
export class BalneariosCreate {
  private readonly balneariosService = inject(BalneariosService);
  private readonly router = inject(Router);

  private readonly form = viewChild.required(BalneariosForm);

  protected readonly guardando = signal(false);

  onSubmit(data: Omit<Balneario, 'id'>): void {
    this.guardando.set(true);
    this.balneariosService.addBalneario(data).subscribe(({ id }) => {
      this.form().notifySubmissionCompleted();
      this.guardando.set(false);
      this.router.navigate(['/balnearios', id]);
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
