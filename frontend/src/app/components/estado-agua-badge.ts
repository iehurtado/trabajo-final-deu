import { Component, computed, input } from "@angular/core";
import { Balneario } from "../balnearios.service";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-estado-agua-badge',
  imports: [NgClass],
  template: `
  <span class="badge" [ngClass]="bgClass()">
      {{ label() }}
  </span>
  `
})
export class EstadoAguaBadge {
  readonly balneario = input.required<Balneario>();

  protected readonly bgClass = computed(() => {
    switch (this.balneario().estadoAgua) {
      case "APTO": return "text-bg-success";
      case "PRECAUCION": return "text-bg-warning";
      case "NO_APTO": return "text-bg-danger";
      default: return "text-bg-dark";
    }
  });

  protected readonly label = computed(() => {
    switch (this.balneario().estadoAgua) {
      case "APTO": return "Apto";
      case "PRECAUCION": return "Precaución";
      case "NO_APTO": return "No Apto";
      default: return "Desconocido";
    }
  });
}
