import * as L from "leaflet";
import { defaultIcon } from "./defaults";

export const PuntoInteresIcon = L.icon({
  ...defaultIcon,
  iconSize: [25, 41],
  iconRetinaUrl: 'assets/marker-icon-red-2x.png',
  iconUrl: 'assets/marker-icon-red.png',
});
