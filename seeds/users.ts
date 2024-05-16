import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    { user_id: 1, username: "username 1", password: "asdf", roles: "ADMIN" },
    { user_id: 2, username: "username 2", password: "asdf", roles: "USER" },
    { user_id: 3, username: "usernmae 3", password: "asdf", roles: "REVIEWER" },
    { user_id: 4, username: "usernmae 4", password: "asdf", roles: "USER" },
    { user_id: 5, username: "usernmae 5", password: "asdf", roles: "USER" },
  ]);
}
