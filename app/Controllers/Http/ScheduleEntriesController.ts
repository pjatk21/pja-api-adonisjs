import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ScheduleEntry from 'App/Models/ScheduleEntry'

export default class ScheduleEntriesController {
  public async index ({ request }: HttpContextContract) {
    const lastFetch = await ScheduleEntry
      .query()
      .orderBy('created_at', 'desc')
      .select('created_at')
      .first()

    const entriesCount = (await ScheduleEntry.query().select('id')).length

    return {
      lastFetch: lastFetch?.createdAt ?? null,
      entriesCount: entriesCount,
      endpoints: {
        available: 'http://' + request.host() + '/schedule/available',
      }
    }
  }

  public async getByDay ({ params }: HttpContextContract) {
    const { date } = params as { date: string }

    const entries = await ScheduleEntry
      .query()
      .where('date_string', date)

    return {
      entries
    }
  }

  public async getByCode ({ params }: HttpContextContract) {
    const { code } = params as { code: string }

    const entries = await ScheduleEntry
      .query()
      .where('code', code)

    return {
      entries
    }
  }

  public async getByGroup ({ params }: HttpContextContract) {
    const { group } = params as { group: string }

    const entries = await ScheduleEntry
      .query()
      .where('groups', 'like', `%${group}%`)

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
        .map(o => o.groups),
      availableCodes: (await ScheduleEntry
          .query()
          .select('code')
          .whereNotNull('code')
          .groupBy('code'))
          .map(o => o.code)
    }
  }
}
