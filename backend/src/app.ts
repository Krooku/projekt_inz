import express from 'express'
import session from 'express-session'
import connectSQLite3 from 'connect-sqlite3'
import cors from 'cors'
import path from 'path'

import config from './config'
import router from './routes'

const SQLiteStore = connectSQLite3(session)
const app = express()

if (config.useCors) {
  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true
    })
  )
}

app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db'
  }),
  secret: config.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}))

app.use(express.json())
app.disable('x-powered-by')

app.use('/api', router)
app.use('/static', express.static(path.join(__dirname, '/../static')))

export default app
