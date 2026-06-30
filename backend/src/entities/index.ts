import { p, defineEntity, InferEntity } from "@mikro-orm/postgresql";

export const Rol = defineEntity({
  name: "Rol",
  properties: {
    id: p.integer().primary(),
    nombre: p.string().unique(),
  },
});

export type Rol = InferEntity<typeof Rol>;

export const User = defineEntity({
  name: "User",
  properties: {
    id: p.integer().primary(),
    email: p.string().unique(),
    fullname: p.string(),
    password: p.string().hidden(),
    roles: () => p.manyToMany(Rol).eager(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
  }
});

export type User = InferEntity<typeof User>;

export const Balneario = defineEntity({
  name: "Balneario",
  properties: {
    id: p.integer().primary(),
    nombre: p.string().unique(),
    latitud: p.float(),
    longitud: p.float(),
    estadoAgua: p.enum(["APTO", "PRECAUCION", "NO_APTO"]),
    auxilio: p.boolean(),
    banos: p.boolean(),
    rampa: p.boolean(),
    vigilancia: p.boolean(),
    parrillas: p.boolean(),
    bus: p.boolean(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
  }
});

export type Balneario = InferEntity<typeof Balneario>;

export const PuntoInteres = defineEntity({
  name: "PuntoInteres",
  properties: {
    id: p.integer().primary(),
    nombre: p.string().unique(),
    latitud: p.float(),
    longitud: p.float(),
    categoria: p.string(),
    subcategoria: p.string(),
    descripcion: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
  }
});

export type PuntoInteres = InferEntity<typeof PuntoInteres>;
