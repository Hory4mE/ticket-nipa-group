import bcrypt from "bcrypt";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("tickets").del();
    await knex("users").del();

    await knex("users").insert([
        {
            user_id: "fe2c7116-6334-41fd-b675-193c6ccbcaa5",
            username: "username1",
            password: await bcrypt.hash("1234", parseInt(process.env.SALT!)),
            first_name: "firstname",
            last_name: "last_name",
            email: "email@email.com",
            roles: "ADMIN",
        },
        {
            user_id: "bad5786f-6ae2-4275-8e55-b85a0bc8461e",
            username: "username2",
            password: await bcrypt.hash("1234", parseInt(process.env.SALT!)),
            first_name: "firstname",
            last_name: "last_name",
            email: "email@email.com",
            roles: "USER",
        },
        {
            user_id: "315e46bf-7ad9-4774-9bc3-137bb0661ead",
            username: "usernmae3",
            password: await bcrypt.hash("1234", parseInt(process.env.SALT!)),
            first_name: "firstname",
            last_name: "last_name",
            email: "email@email.com",
            roles: "REVIEWER",
        },
        {
            user_id: "34609b96-1c7a-438e-b6db-c8d64b94d285",
            username: "usernmae4",
            password: await bcrypt.hash("1234", parseInt(process.env.SALT!)),
            first_name: "firstname",
            last_name: "last_name",
            email: "email@email.com",
            roles: "USER",
        },
        {
            user_id: "ab92989b-dc61-4a26-88c9-07317a2853f4",
            username: "usernmae5",
            password: await bcrypt.hash("1234", parseInt(process.env.SALT!)),
            first_name: "firstname",
            last_name: "last_name",
            email: "email@email.com",
            roles: "USER",
        },
    ]);
    // Inserts seed entries
    await knex("tickets").insert([
        {
            ticket_id: "f6a20740-00f3-45bf-ada1-596479e500a1",
            title: "rowValue1",
            description: "",
            status: "PENDING",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: "bad5786f-6ae2-4275-8e55-b85a0bc8461e",
        },
        {
            ticket_id: "5f5b3a33-1a52-4b9b-82cd-7947552b9a1d",
            title: "rowValue2",
            description: "gegeg",
            status: "PENDING",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: "ab92989b-dc61-4a26-88c9-07317a2853f4",
        },
        {
            ticket_id: "6703a866-f329-4eee-812e-babdd6765597",
            title: "rowValue3",
            status: "PENDING",
            description: "rtyuiol",
            created_date: "2024-05-01 19:43:46",
            updated_date: "2024-05-06 16:43:09",
            is_delete: false,
            user_id: "bad5786f-6ae2-4275-8e55-b85a0bc8461e",
        },
    ]);
}
