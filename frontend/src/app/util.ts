import { HttpErrorResponse } from "@angular/common/http";
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

export function getUserFriendlyErrorMessage(error: unknown, entityName: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 401) {
      return 'No tiene autorización para acceder a este recurso';
    }

    if (error.status === 404) {
      return `${entityName} no encontrado`;
    }
  }

  return 'Ha ocurrido un error desconocido';
}

export const confirmOnUnsavedChanges = <T extends ReportsUnsaved>(component: T) => {
  const dialog = inject(DialogService);

  if (component.hasUnsavedChanges()) {
    return dialog.confirm({ message: 'Tiene cambios sin guardar. Si continúa se perderán ¿desea salir igualmente?' });
  }
  return true;
}
