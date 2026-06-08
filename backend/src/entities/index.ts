import { defineEntity, InferEntity, p } from "@mikro-orm/core";

export const User = defineEntity({
  name: "User",
  properties: {
    id: p.integer().primary(),
    email: p.string().unique(),
    fullname: p.string(),
    password: p.string(),
  }
})

export type User = InferEntity<typeof User>
