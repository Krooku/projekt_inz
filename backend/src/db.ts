import mongoose from 'mongoose'
import config from './config'

export default function connectDatabase () {
  return mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}
