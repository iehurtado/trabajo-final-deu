import { Component, inject, input, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BalneariosForm } from "../components/balnearios-form/balnearios-form";
import { Balneario, BalneariosService } from '../balnearios.service';
import { ReportsUnsaved } from '../util';

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

  private readonly form = viewChild.required(BalneariosForm);

  protected readonly balneario = input<Balneario>();

  onSubmit(data: Omit<Balneario, 'id'>): void {
    const id = this.balneario()?.id;
    if (!id) return;

    this.balneariosService.updateBalneario(id, data).subscribe(() => {
      this.form().notifySubmissionCompleted();
      this.router.navigate(['/balnearios', id]);
    });
  }

  hasUnsavedChanges(): boolean {
    return this.form().hasUnsavedChanges();
  }
}
