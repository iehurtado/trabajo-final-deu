import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Balneario, PuntoInteres } from 'src/entities';

export class PuntosInteresSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const puntosInteres = [
      {
        nombre: "Punta Lara - Zona Camping",
        latitud: -34.820, longitud: -57.965,
        categoria: "Contaminantes",
        subcategoria: "Plásticos",
        descripcion: "Presencia masiva de microplásticos y residuos sólidos urbanos."
      },
      {
        nombre: "Desembocadura Arroyo El Gato",
        latitud: -34.835, longitud: -57.955,
        categoria: "Contaminantes",
        subcategoria: "Descarga cloacal",
        descripcion: "Altos niveles de detergentes y descargas cloacales sin tratamiento."
      },
      {
        nombre: "Costa de Berisso - Palo Blanco",
        latitud: -34.860, longitud: -57.845,
        categoria: "Contaminantes",
        subcategoria: "Aceite/Hidrocarburos",
        descripcion: "Manchas de aceite y restos de hidrocarburos provenientes del puerto."
      },
      {
        nombre: "Ribera de Quilmes",
        latitud: -34.715, longitud: -58.235,
        categoria: "Contaminantes",
        subcategoria: "Plásticos/Residuos sólidos",
        descripcion: "Acumulación de plásticos de un solo uso y restos de redes de pesca."
      },
      {
        nombre: "Costa de Hudson",
        latitud: -34.785, longitud: -58.155,
        categoria: "Contaminantes",
        subcategoria: "Descarga industrial",
        descripcion: "Descargas industriales y sedimentos contaminados."
      },
      {
        nombre: "Reserva Natural Integral Punta Lara",
        latitud: -34.780, longitud: -58.000,
        categoria: "Contaminantes",
        subcategoria: "Residuos Sólidos",
        descripcion: "Acumulación de basura transportada por la marea en zona protegida."
      },
      {
        nombre: "Arroyo del Medio - Berisso",
        latitud: -34.880, longitud: -57.820,
        categoria: "Contaminantes",
        subcategoria: "Efluentes Mixtos",
        descripcion: "Descargas de efluentes industriales y residuos domésticos."
      },
      {
        nombre: "Playa La Balandra",
        latitud: -34.920, longitud: -57.780,
        categoria: "Contaminantes",
        subcategoria: "Plásticos",
        descripcion: "Presencia de plásticos y restos de fogatas en zona recreativa."
      },
      {
        nombre: "Puerto de La Plata - Canal de Acceso",
        latitud: -34.810, longitud: -57.900,
        categoria: "Contaminantes",
        subcategoria: "Hidrocarburos/Metales",
        descripcion: "Efluentes de buques y sedimentos con metales pesados."
      },
      {
        nombre: "Desembocadura Arroyo Sarandí",
        latitud: -34.660, longitud: -58.330,
        categoria: "Contaminantes",
        subcategoria: "Químicos/Cloacales",
        descripcion: "Altos niveles de contaminación química y cloacal."
      },
      {
        nombre: "Costa de Wilde",
        latitud: -34.680, longitud: -58.290,
        categoria: "Contaminantes",
        subcategoria: "Residuos Sólidos",
        descripcion: "Basurales a cielo abierto en la franja costera."
      }
    ];

    for (const punto of puntosInteres) {
      await em.upsert(PuntoInteres, punto);
    }

    await em.flush();
  }
}
