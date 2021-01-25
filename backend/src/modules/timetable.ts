import { EventModule } from '.'

export default new EventModule({
  id: 'timetable',
  name: 'Terminarz',
  routesHandler: (router) => {
    router.get('/', (req, res) => {
      res.json('Hello World!')
    })
  }
})
