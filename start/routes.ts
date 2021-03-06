/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return {
    hello: 'world',
    author: 'https://github.com/pjatk21'
  }
})

Route.group(() => {
  Route.get('/', 'ScheduleEntriesController.index')
  Route.get('/date/:date', 'ScheduleEntriesController.getByDay').where('date', /\d{4}-\d{2}-\d{2}/)
  Route.get('/code/:code', 'ScheduleEntriesController.getByCode').where('code', /[A-Z]{2,4}/)
  Route.get('/group/:group', 'ScheduleEntriesController.getByGroup').where('group', /.*\d{1,3}\w/)
  Route.get('/available', 'ScheduleEntriesController.available')
}).prefix('/schedule')
