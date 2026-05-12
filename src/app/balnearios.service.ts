import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";

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

@Injectable({ providedIn: 'root' })
export class BalneariosService {
    private readonly balnearios = new BehaviorSubject<Balneario[]>([
        {
            id: 1,
            nombre: "Balneario Municipal Punta Lara",
            latitud: -34.821, longitud: -57.968,
            estadoAgua: "Apto",
            auxilio: true, banos: true, rampa: true, vigilancia: true, parrillas: true, bus: true
        },
        {
            id: 2,
            nombre: "Playa La Balandra",
            latitud: -34.920, longitud: -57.780,
            estadoAgua: "Precaución",
            auxilio: true, banos: true, rampa: false, vigilancia: true, parrillas: true, bus: true
        },
        {
            id: 3,
            nombre: "Playa Bagliardi",
            latitud: -34.875, longitud: -57.810,
            estadoAgua: "No Apto",
            auxilio: false, banos: false, rampa: false, vigilancia: false, parrillas: true, bus: false
        }
    ]);

    getBalnearios(): Observable<Balneario[]> {
        return this.balnearios.asObservable();
    }

    getBalnearioById(id: number): Observable<Balneario | undefined> {
        return of(this.balnearios.value.find(b => b.id === id));
    }

    addBalneario(nuevo: Omit<Balneario, 'id'>): Observable<Balneario> {
        const current = this.balnearios.value;
        const nextId = current.length > 0 ? Math.max(...current.map(b => b.id)) + 1 : 1;
        const agregado = { ...nuevo, id: nextId };
        this.balnearios.next([...current, agregado]);
        return of(agregado);
    }
}
