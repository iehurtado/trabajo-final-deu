import { inject } from "@angular/core";
import { LatLngExpression } from "leaflet";
import { DialogService } from "./components/dialog/dialog.service";

export const PUNTA_LARA = [ -34.820, -57.965 ] as LatLngExpression;

export function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
export interface ReportsUnsaved {
  hasUnsavedChanges(): boolean;
}

export const confirmOnUnsavedChanges = <T extends ReportsUnsaved>(component: T) => {
  const dialog = inject(DialogService);

  if (component.hasUnsavedChanges()) {
    return dialog.confirm({ message: 'Tiene cambios sin guardar. Si continúa se perderán ¿desea salir igualmente?' });
  }
  return true;
}
