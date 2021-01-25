import { EventModule } from '.'

export default new EventModule({
  id: 'decorations',
  name: 'Dekoracje',
  routesHandler: (router) => {
    router.get('/', (req, res) => {
      res.json('Hello World!')
    })
  }
})
