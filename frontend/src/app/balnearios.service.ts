import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { BalneariosService as BalneariosControllerService } from "../api";

export interface Balneario {
    id: number;
    nombre: string;
    latitud: number;
    longitud: number;
    estadoAgua: string;
    auxilio: boolean;
    banos: boolean;
    rampa: boolean;
    vigilancia: boolean;
    parrillas: boolean;
    bus: boolean;
}

type Paginator<T> = {
  data: T[];
  paginatorInfo: {
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
};

@Injectable({ providedIn: 'root' })
export class BalneariosService {

    private balneariosController = inject(BalneariosControllerService);

    getBalnearios(): Observable<Balneario[]>
    getBalnearios(page: number, perPage?: number): Observable<Paginator<Balneario>>
    getBalnearios(page?: number, perPage?: number): Observable<Paginator<Balneario>|Balneario[]> {
        if (page == undefined) {
          return this.balneariosController.findAllBalnearios(1, Infinity).pipe(map(x => x.data));
        }

        return this.balneariosController.findAllBalnearios(page, perPage ?? 10);
    }

    getBalnearioById(id: number): Observable<Balneario | undefined> {
        return this.balneariosController.findBalnearioById(id);
    }

    addBalneario(nuevo: Omit<Balneario, 'id'>): Observable<Balneario> {
        return this.balneariosController.createBalneario(nuevo);
    }

    updateBalneario(id: number, data: Omit<Balneario, 'id'>): Observable<Balneario> {
        return this.balneariosController.updateBalneario(id, data);
    }
}
