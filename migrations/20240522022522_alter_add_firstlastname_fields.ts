import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("users", (table) => {
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("email").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("users", (table) => {
        table.dropColumn("first_name");
        table.dropColumn("last_name");
        table.dropColumn("email");
    });
}
