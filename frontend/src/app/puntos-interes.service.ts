import { Injectable, inject } from "@angular/core";
import { Observable, delay, map } from "rxjs";
import { PuntosInteresService as PuntosInteresControllerService } from '../api';

export interface PuntoInteres {
    id: number;
    nombre: string;
    latitud: number;
    longitud: number;
    categoria: string;
    subcategoria: string;
    descripcion?: string; // Opcional
}

type Paginator<T> = {
  data: T[];
  paginatorInfo: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    total: number;
  };
};

@Injectable({ providedIn: 'root' })
export class PuntosInteresService {
    private puntosInteresController = inject(PuntosInteresControllerService);

    getPuntosInteres(): Observable<PuntoInteres[]>
    getPuntosInteres(page: number, perPage?: number): Observable<Paginator<PuntoInteres>>
    getPuntosInteres(page?: number, perPage?: number): Observable<Paginator<PuntoInteres> | PuntoInteres[]> {
        if (page == undefined) {
            return this.puntosInteresController.findAllPuntosInteres(1, Infinity).pipe(map(x => x.data));
        }

        return this.puntosInteresController.findAllPuntosInteres(page, perPage ?? 10);
    }

    getPuntoInteresById(id: number): Observable<PuntoInteres> {
        return this.puntosInteresController.findPuntoInteresById(id);
    }

    addPuntoInteres(nuevoPunto: Omit<PuntoInteres, 'id'>): Observable<PuntoInteres> {
        return this.puntosInteresController.createPuntoInteres(nuevoPunto).pipe(delay(1200));
    }

    updatePuntoInteres(id: number, data: Omit<PuntoInteres, 'id'>): Observable<PuntoInteres> {
        return this.puntosInteresController.updatePuntoInteres(id, data).pipe(delay(1200));
    }
}
