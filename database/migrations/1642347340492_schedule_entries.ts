import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ScheduleEntries extends BaseSchema {
  protected tableName = 'schedule_entries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('name').nullable()
      table.string('code').nullable()
      table.string('type').nullable()
      table.string('groups').nullable()
      table.string('building').nullable()
      table.string('room').nullable()
      table.string('tutor').nullable()
      table.string('date_string')
      table.dateTime('begin')
      table.dateTime('end')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
