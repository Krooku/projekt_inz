import { EventModule } from '.'

export default new EventModule({
  id: 'test',
  name: 'Moduł testowy',
  routesHandler: (router) => {
    router.get('/', (req, res) => {
      res.json('This is a Test Module!')
    })

    router.get('/hello', (req, res) => {
      res.json(`Hello World event ${req.params.eventId}!`)
    })
  }
})
