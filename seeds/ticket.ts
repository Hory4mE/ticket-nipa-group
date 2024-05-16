import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("tickets").del();
    await knex("users").del();

    await knex("users").insert([
        { user_id: 1, username: "username 1", password: "asdf", roles: "ADMIN" },
        { user_id: 2, username: "username 2", password: "asdf", roles: "USER" },
        { user_id: 3, username: "usernmae 3", password: "asdf", roles: "REVIEWER" },
        { user_id: 4, username: "usernmae 4", password: "asdf", roles: "USER" },
        { user_id: 5, username: "usernmae 5", password: "asdf", roles: "USER" },
    ]);
    // Inserts seed entries
    await knex("tickets").insert([
        {
            ticket_id: 1,
            title: "rowValue1",
            description: "",
            status: "PENDING",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: 1,
        },
        {
            ticket_id: 2,
            title: "rowValue2",
            description: "gegeg",
            status: "PENDING",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: 2,
        },
        {
            ticket_id: 3,
            title: "rowValue3",
            status: "PENDING",
            description: "rtyuiol",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: 3,
        },
    ]);
}
