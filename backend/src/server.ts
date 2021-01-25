import app from './app'
import config from './config'
import * as ModuleManager from './modules'
import connectDatabase from './db'

connectDatabase().then(async () => {
  await ModuleManager.initializeModules()
  app.listen(config.expressPort, () => {
    console.log(`Server is listening on port ${config.expressPort}`)
  })
}).catch((error) => {
  console.log('Error occured while initializing server')
  console.error(error)
  process.exit()
})
