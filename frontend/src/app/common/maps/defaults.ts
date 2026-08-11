import * as L from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

export const defaultIcon = L.icon({
    ...L.Icon.Default,
    iconSize: [25, 41],
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    shadowAnchor: [12, 41],
    iconAnchor: [12, 41],
});