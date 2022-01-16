import { BaseTask } from 'adonis5-scheduler/build'
import ScheduleEntry from 'App/Models/ScheduleEntry'
import { DateTime } from 'luxon'
import { fetchDays } from 'pja-schedule-scrapper'
import Logger from '@ioc:Adonis/Core/Logger'

export default class GetWeeklySchedule extends BaseTask {
  public static get schedule () {
    // At minute 0 past hour 3, 13, and 23
    return process.env.NODE_ENV === 'development' ? '*/30 * * * * * *' : '0 3,13,23 * * * *'
  }

  public static get useLock () {
    return true
  }

  public async handle () {
    Logger.info('Starting weekly fetch')
    const datesToFetch: string[] = []
    let day = DateTime.now()

    for (let i = 0; i < 14; i++) {
      datesToFetch.push(day.toFormat('yyyy-MM-dd'))
      day = day.plus({ days: 1 })
    }

    Logger.info('Downloading next 14 days', datesToFetch)
    const results = await fetchDays(datesToFetch)

    for (const result of results) {
      await ScheduleEntry.query().where('date_string', result.date).delete()
      for (const entry of result.entries) {
        const se = await ScheduleEntry.create({
          ...entry,
          dateString: entry.dateString,
          begin: DateTime.fromJSDate(entry.begin),
          end: DateTime.fromJSDate(entry.end)
        })
        await se.save()
      }
    }
  }
}
