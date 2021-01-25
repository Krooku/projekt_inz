import { EventModule } from '.'

export default new EventModule({
  id: 'place',
  name: 'Lokal',
  routesHandler: (router) => {
    router.get('/', (req, res) => {
      res.json('Hello World!')
    })
  }
})
