import * as L from "leaflet";
import { defaultIcon } from "./defaults";

export const PuntoInteresIcon = L.icon({
  ...defaultIcon,
  iconSize: [36, 48],
  iconRetinaUrl: 'assets/icon-punto-interes.png',
  iconUrl: 'assets/icon-punto-interes.png',
});

export const BalnearioIcon = L.icon({
  ...defaultIcon,
  iconSize: [36, 48],
  iconRetinaUrl: 'assets/icon-balneario.png',
  iconUrl: 'assets/icon-balneario.png',
});
