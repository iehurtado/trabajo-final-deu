import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, map, take } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";

export interface PuntoInteres {
    id: number;
    nombre: string;
    latitud: number;
    longitud: number;
    categoria: string;
    subcategoria: string;
    descripcion?: string; // Opcional
}

@Injectable({ providedIn: 'root' })
export class PuntosInteresService {
    private readonly puntos = new BehaviorSubject<PuntoInteres[]>([
        {
            id: 1,
            nombre: "Punta Lara - Zona Camping",
            latitud: -34.820, longitud: -57.965,
            categoria: "Contaminantes",
            subcategoria: "Plásticos",
            descripcion: "Presencia masiva de microplásticos y residuos sólidos urbanos."
        },
        {
            id: 2,
            nombre: "Desembocadura Arroyo El Gato",
            latitud: -34.835, longitud: -57.955,
            categoria: "Contaminantes",
            subcategoria: "Descarga cloacal",
            descripcion: "Altos niveles de detergentes y descargas cloacales sin tratamiento."
        },
        {
            id: 3,
            nombre: "Costa de Berisso - Palo Blanco",
            latitud: -34.860, longitud: -57.845,
            categoria: "Contaminantes",
            subcategoria: "Aceite/Hidrocarburos",
            descripcion: "Manchas de aceite y restos de hidrocarburos provenientes del puerto."
        },
        {
            id: 4,
            nombre: "Ribera de Quilmes",
            latitud: -34.715, longitud: -58.235,
            categoria: "Contaminantes",
            subcategoria: "Plásticos/Residuos sólidos",
            descripcion: "Acumulación de plásticos de un solo uso y restos de redes de pesca."
        },
        {
            id: 5,
            nombre: "Costa de Hudson",
            latitud: -34.785, longitud: -58.155,
            categoria: "Contaminantes",
            subcategoria: "Descarga industrial",
            descripcion: "Descargas industriales y sedimentos contaminados."
        }
    ]);

    constructor() { }

    getPuntosInteres(): Observable<PuntoInteres[]> {
        // Por ahora devolvemos datos hardcodeados
        return this.puntos.asObservable();
    }

    getPuntoInteresById(id: number): Observable<PuntoInteres | undefined> {
        return this.puntos.pipe(
            take(1),
            map(puntos => puntos.find(p => p.id === id))
        );
    }
}