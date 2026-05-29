import * as L from "leaflet";
import { PuntoInteres } from "../../puntos-interes.service";
import { Balneario } from "../../balnearios.service";
import { defaultIcon } from "./defaults";

export const PuntoMapa = {
  fromPuntoInteres(p: PuntoInteres): PuntoMapa {
    return {
      markerOptions: {
        icon: L.icon({
          ...defaultIcon,
          iconSize: [25, 41],
          iconRetinaUrl: 'assets/marker-icon-red-2x.png',
          iconUrl: 'assets/marker-icon-red.png',
        }),
        alt: `Punto de Interés ${p.nombre}`,
        title: 'Ver detalle',
      },
      latitud: p.latitud,
      longitud: p.longitud,
      popup: () => `
        <div class="leaflet-popup-custom">
          <h6 class="fw-bold mb-1">${p.nombre}</h6>
          <div class="mb-2">
            <span class="badge bg-danger me-1">${p.categoria}</span>
            <span class="badge bg-secondary">${p.subcategoria}</span>
          </div>
          <p class="small text-muted mb-2">${p.descripcion || ''}</p>
          <a href="/puntos/${p.id}" class="btn btn-sm btn-primary w-100 text-white">Ver detalles</a>
        </div>`
    };
  },
  fromBalneario(b: Balneario): PuntoMapa {
    const estadoClass = b.estadoAgua === 'Apto' ? 'bg-success' : (b.estadoAgua === 'Precaución' ? 'bg-warning text-dark' : 'bg-danger');

    const servicios = [
      { key: 'auxilio', label: 'AUXILIO' },
      { key: 'banos', label: 'BAÑOS' },
      { key: 'rampa', label: 'RAMPA' },
      { key: 'vigilancia', label: 'VIGILANCIA' },
      { key: 'parrillas', label: 'PARRILLAS' },
      { key: 'bus', label: 'BUS' }
    ]
    .filter(s => (b as any)[s.key])
    .map(s => `<span class="badge bg-light text-dark border me-1 mb-1" style="font-size: 0.65rem;">${s.label}</span>`)
    .join('');

    return {
      markerOptions: {
        alt: `Balneario ${b.nombre}`,
        title: 'Ver detalle',
      },
      latitud: b.latitud,
      longitud: b.longitud,
      popup: () => `
        <div class="leaflet-popup-custom">
          <h6 class="fw-bold mb-1">${b.nombre}</h6>
          <div class="mb-2">
            Estado Actual: <span class="badge ${estadoClass}">${b.estadoAgua}</span>
          </div>
          <div class="d-flex flex-wrap mb-2">
            ${servicios}
          </div>
          <a href="/balnearios/${b.id}" class="btn btn-sm btn-primary w-100 text-white">Ver detalles</a>
        </div>`
    };
  }
};

export type PuntoMapa = {
  markerOptions?: L.MarkerOptions;
  popup: ((l: L.Layer) => L.Content);
  latitud: number;
  longitud: number;
};
