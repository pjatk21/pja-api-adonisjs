import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import ScheduleEntry from 'App/Models/ScheduleEntry'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { Scrapper, ScheduleEntry as SEntry } from 'pja-scrapper'

export default class Polldata extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'polldata'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Polls data from scrapper'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  @flags.boolean({ alias: 'l', 'description': 'Does it should run in a loop?', name: 'looped' })
  public looped: boolean = false

  public async run() {
    const { scrapper } = await Scrapper.dockerRuntime()

    if (this.looped) {
      this.logger.warning('Running in looped mode')
      while (true) {
        await this.poll(scrapper, this.getDates(14))
        // sleep for a hour
        await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 60))
      }
    } else {
      await this.poll(scrapper, this.getDates(14))
    }
  }

  private getDates(days: number) {
    const dates: string[] = []
    let day = DateTime.now()

    for (let i = 0; i < days; i++) {
      dates.push(day.toFormat('yyyy-MM-dd'))
      day = day.plus({ days: 1 })
    }

    return dates
  }

  private async poll(worker: Scrapper, dates: string[]) {
    for (const dateString of dates) {
      const { date, entries } = await worker.fetchDay(dateString)
      await this.sink(date, entries)
    }
  }

  private async sink(date: string, entries: SEntry[]) {
    await ScheduleEntry.query().where('date_string', date).delete()

    for (const entry of entries) {
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
