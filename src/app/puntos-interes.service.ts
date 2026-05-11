import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, map, of, take } from "rxjs";
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
        },
        {
            id: 6,
            nombre: "Reserva Natural Integral Punta Lara",
            latitud: -34.780, longitud: -58.000,
            categoria: "Contaminantes",
            subcategoria: "Residuos Sólidos",
            descripcion: "Acumulación de basura transportada por la marea en zona protegida."
        },
        {
            id: 7,
            nombre: "Arroyo del Medio - Berisso",
            latitud: -34.880, longitud: -57.820,
            categoria: "Contaminantes",
            subcategoria: "Efluentes Mixtos",
            descripcion: "Descargas de efluentes industriales y residuos domésticos."
        },
        {
            id: 8,
            nombre: "Playa La Balandra",
            latitud: -34.920, longitud: -57.780,
            categoria: "Contaminantes",
            subcategoria: "Plásticos",
            descripcion: "Presencia de plásticos y restos de fogatas en zona recreativa."
        },
        {
            id: 9,
            nombre: "Puerto de La Plata - Canal de Acceso",
            latitud: -34.810, longitud: -57.900,
            categoria: "Contaminantes",
            subcategoria: "Hidrocarburos/Metales",
            descripcion: "Efluentes de buques y sedimentos con metales pesados."
        },
        {
            id: 10,
            nombre: "Desembocadura Arroyo Sarandí",
            latitud: -34.660, longitud: -58.330,
            categoria: "Contaminantes",
            subcategoria: "Químicos/Cloacales",
            descripcion: "Altos niveles de contaminación química y cloacal."
        },
        {
            id: 11,
            nombre: "Costa de Wilde",
            latitud: -34.680, longitud: -58.290,
            categoria: "Contaminantes",
            subcategoria: "Residuos Sólidos",
            descripcion: "Basurales a cielo abierto en la franja costera."
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

    addPuntoInteres(nuevoPunto: Omit<PuntoInteres, 'id'>): Observable<PuntoInteres> {
        const currentPuntos = this.puntos.value;
        const nextId = currentPuntos.length > 0 ? Math.max(...currentPuntos.map(p => p.id)) + 1 : 1;
        const agregado = { ...nuevoPunto, id: nextId };
        this.puntos.next([...currentPuntos, agregado]);

        return of(agregado);
    }
}