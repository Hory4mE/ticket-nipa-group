import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("user_id").primary().notNullable();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table
      .enum("roles", ["ADMIN", "USER", "REVIEWER"])
      .defaultTo("USER")
      .notNullable();
    table.boolean("is_delete").defaultTo(false).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
