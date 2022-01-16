import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ScheduleEntry extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string | null

  @column()
  public code: string | null

  @column()
  public type: string | null

  @column()
  public groups: string | null

  @column()
  public building: string | null

  @column()
  public room: string | null

  @column()
  public tutor: string | null

  @column()
  public dateString: string

  @column.dateTime()
  public begin: DateTime

  @column.dateTime()
  public end: DateTime
}
