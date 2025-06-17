import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('revoked_tokens', (table) => {
    table.increments('id').primary();
    table.string('jti', 255).notNullable().unique();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamp('revoked_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();

    table.index('jti');
    table.index('expires_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('revoked_tokens');
}
