import { Component, inject, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Balneario } from "../balnearios.service";
import { AuthService } from "../auth.service";

const servicios = [
  { key: 'auxilio', label: 'AUXILIO' },
  { key: 'banos', label: 'BAÑOS' },
  { key: 'rampa', label: 'RAMPA' },
  { key: 'vigilancia', label: 'VIGILANCIA' },
  { key: 'parrillas', label: 'PARRILLAS' },
  { key: 'bus', label: 'BUS' }
];

@Component({
  selector: 'app-popup-balneario',
  imports: [RouterLink],
  template: `
    <h6 class="fw-bold mb-1 text-nowrap">{{ balneario.nombre }}</h6>
    <div class="mb-2 text-nowrap">
      Estado Actual: <span class="badge {{ estadoClass }}">{{ balneario.estadoAgua }}</span>
    </div>
    <div class="d-flex flex-wrap mb-2">
      @for (s of servicios; track s) {
        <span class="badge bg-light text-dark border me-1 mb-1" style="font-size: 0.65rem;">{{s.label}}</span>
      }
    </div>
    @if (canViewDetail()) {
      <div class="text-end">
        <a [routerLink]="['/balnearios', balneario.id ]" class="btn btn-primary btn-sm text-white">Ir a detalle</a>
      </div>
    }
  `
})
export class PopupBalneario {
  protected readonly auth = inject(AuthService);
  protected readonly canViewDetail = this.auth.can('Administrador');

  @Input({ required: true }) balneario!: Balneario;

  get estadoClass() {
    if (this.balneario.estadoAgua === 'Apto') {
      return 'bg-success';
    }

    return this.balneario.estadoAgua === 'Precaución'
      ? 'bg-warning text-dark'
      : 'bg-danger';
  }

  get servicios() {
    return servicios.filter(x => (this.balneario as any)[x.key]);
  }
}
