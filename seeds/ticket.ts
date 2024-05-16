import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("tickets").del();

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
    },
    {
      ticket_id: 2,
      title: "rowValue2",
      description: "gegeg",
      status: "PENDING",
      created_date: "2024-05-01 19:43:46",
      updated_date: "2024-05-06 16:43:09",
      is_delete: false,
    },
    {
      ticket_id: 3,
      title: "rowValue3",
      status: "PENDING",
      description: "rtyuiol",
      created_date: "2024-05-01 19:43:46",
      updated_date: "2024-05-06 16:43:09",
      is_delete: false,
    },
  ]);
}
