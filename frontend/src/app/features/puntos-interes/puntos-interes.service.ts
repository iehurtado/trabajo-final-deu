import { Injectable, inject } from "@angular/core";
import { PuntosInteresService as PuntosInteresControllerService } from '@api/services';
import { Observable, map } from "rxjs";

export interface PuntoInteres {
    id: number;
    nombre: string;
    latitud: number;
    longitud: number;
    categoria: string;
    subcategoria: string;
    descripcion?: string; // Opcional
    createdAt: string;
    updatedAt: string;
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

    getPuntoInteresByNombre(nombre: string): Observable<PuntoInteres> {
        return this.puntosInteresController.findAllPuntosInteres(1, Infinity, nombre).pipe(
          map(x => x.data[0])
        );
    }

    addPuntoInteres(nuevoPunto: Omit<PuntoInteres, 'id'|'createdAt'|'updatedAt'>): Observable<PuntoInteres> {
        return this.puntosInteresController.createPuntoInteres(nuevoPunto);
    }

    updatePuntoInteres(id: number, data: Omit<PuntoInteres, 'id'|'createdAt'|'updatedAt'>): Observable<PuntoInteres> {
        return this.puntosInteresController.updatePuntoInteres(id, data);
    }

    deletePuntoInteres(id: number) {
        return this.puntosInteresController.deletePuntoInteres(id);
    }
}
