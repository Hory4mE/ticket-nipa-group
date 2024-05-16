import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("tickets", (table) => {
        table.string("title").notNullable().alter();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("tickets", (table) => {

        table.string("title").alter();
    })

}