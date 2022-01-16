import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ScheduleEntry from 'App/Models/ScheduleEntry'

export default class ScheduleEntriesController {
  public async index () {
    const lastFetch = await ScheduleEntry
      .query()
      .orderBy('created_at', 'desc')
      .select('created_at')
      .first()

    return {
      lastFetch: lastFetch?.createdAt
    }
  }

  public async getDay ({ params }: HttpContextContract) {
    const { date, group } = params as { date: string, group: string }

    const entries = await ScheduleEntry
      .query()
      .where('date_string', date)
      .where('group', group)

    return {
      entries
    }
  }

  public async available () {
    return {
      availableDates: (await ScheduleEntry
        .query()
        .groupBy('date_string')
        .select('date_string'))
        .map(o => o.dateString),
      availableGroups: (await ScheduleEntry
        .query()
        .select('groups')
        .whereNotNull('groups')
        .groupBy('groups'))
        .map(o => o.groups)
    }
  }
}
