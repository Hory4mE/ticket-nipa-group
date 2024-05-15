import type { Knex } from "knex";



export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTableIfNotExists("tickets", (table) => {
        table.uuid("ticket_id").primary();
        table.string("title");
        table.string("description");
        table.text("status").notNullable();
        table.text("created_date").notNullable();
        table.text("updated_date").notNullable();
        table.boolean("is_delete").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("tickets");
}

