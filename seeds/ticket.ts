import * as bcrypt from "bcrypt";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("tickets").del();
    await knex("users").del();
    console.log(await bcrypt.hash("123", parseInt(process.env.SALT!)));

    await knex("users").insert([
        {
            user_id: "be11b053-067f-43b6-ac4a-709503be3ea9",
            username: "username1",
            password: await bcrypt.hash("123", parseInt(process.env.SALT!)),
            roles: "ADMIN",
        },
        {
            user_id: "ccce26c7-9e37-4be5-b9a9-92891afe465d",
            username: "username2",
            password: await bcrypt.hash("123", parseInt(process.env.SALT!)),
            roles: "USER",
        },
        {
            user_id: "284bed41-2f78-4b78-ade5-9075458ddf4c",
            username: "username3",
            password: await bcrypt.hash("123", parseInt(process.env.SALT!)),
            roles: "USER",
        },
        {
            user_id: "b2192797-a2be-4d98-b21e-555b28a50c06",
            username: "username4",
            password: await bcrypt.hash("123", parseInt(process.env.SALT!)),
            roles: "REVIEWER",
        },
    ]);
    // Inserts seed entries
    await knex("tickets").insert([
        {
            ticket_id: "e1d98449-e8a7-45ec-af55-08683ce82647",
            title: "ticket1",
            description: "",
            status: "PENDING",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: "ccce26c7-9e37-4be5-b9a9-92891afe465d",
        },
        {
            ticket_id: "81c580b0-2e1a-4372-beac-7d6c39f96228",
            title: "ticket2",
            description: "something",
            status: "PENDING",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: "ccce26c7-9e37-4be5-b9a9-92891afe465d",
        },
        {
            ticket_id: "b60853c3-1e5f-4c58-a605-50d78763aafb",
            title: "ticket3",
            status: "PENDING",
            description: "something",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: "ccce26c7-9e37-4be5-b9a9-92891afe465d",
        },
    ]);
}
