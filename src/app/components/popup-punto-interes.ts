import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PuntoInteres } from "../puntos-interes.service";

@Component({
  selector: 'app-popup-punto-interes',
  imports: [RouterLink],
  template: `
    <h6 class="fw-bold mb-1 text-nowrap">{{ punto.nombre }}</h6>
    <div class="mb-2 text-nowrap">
      <span class="badge bg-danger me-1">{{ punto.categoria }}</span>
      <span class="badge bg-secondary">{{ punto.subcategoria }}</span>
    </div>
    <p class="small text-muted mb-2">{{ punto.descripcion || '' }}</p>
    <div class="text-end">
      <a [routerLink]="['/puntos', punto.id]" class="btn btn-sm btn-primary text-white">Ir a detalle</a>
    </div>
  `
})
export class PopupPuntoInteres {
  @Input({ required: true }) punto!: PuntoInteres;
}