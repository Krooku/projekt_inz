const ENV = process.env.NODE_ENV || 'development'

interface Config {
  backendUrl: string
  frontendUrl: string
  expressPort: number
  mongoUri: string
  cookieSecret: string
  mailConfig: MailConfig
  mailSender: string
  skipEmailVerification: boolean
  useCors: boolean
}

interface MailConfig {
  service: string
  auth: {
    user: string
    pass: string
  }
}

interface ConfigStore {
  [key: string]: Config
}

const development = {
  backendUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:8080',
  expressPort: 3000,
  mongoUri: 'mongodb://localhost:27017/planner',
  cookieSecret: 'secret!',
  mailConfig: {
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  },
  mailSender: 'Test <test@test.com>',
  skipEmailVerification: false,
  useCors: false
}

const configStore: ConfigStore = {
  // production,
  // test,
  development
}

configStore.production = configStore.development

const selectedConfig = configStore[ENV]
if (!selectedConfig) throw new Error(`Selected config ${ENV} does not exist`)
Object.freeze(selectedConfig)

export default selectedConfig
