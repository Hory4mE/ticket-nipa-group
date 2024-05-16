import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("tickets", (table) => {
    table.boolean("is_delete").defaultTo(false).alter();
    table
      .enum("status", ["IN_PROGRESS", "COMPLETED", "PENDING", "CANCELLED"])
      .defaultTo("PENDING")
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("tickets", (table) => {
    table.boolean("is_delete");
    table.enum("status", ["IN_PROGRESS", "COMPLETED", "PENDING", "CANCELLED"]);
  });
}
