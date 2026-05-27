import { LatLngExpression } from "leaflet";

export const PUNTA_LARA = [ -34.820, -57.965 ] as LatLngExpression;

export function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
