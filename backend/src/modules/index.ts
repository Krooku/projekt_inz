import { promises as fs } from 'fs'
import path from 'path'
import express from 'express'
import { ModuleInfo } from '../models'

interface ModuleStore {
  [key: string]: EventModule | undefined
}

interface ModuleOptions {
  id: string
  name: string
  routesHandler: (router: express.Router) => void
  onEnabled?: (eventId: string) => any
  onDisabled?: (eventId: string) => any
  disabled?: boolean
}

const loadedModules: ModuleStore = {}

export const ModuleRouter = express.Router({ mergeParams: true })

export class EventModule {
  id: string
  name: string
  routesHandler: (router: express.Router) => void
  onEnabled: (eventId: string) => Promise<void>
  onDisabled: (eventId: string) => Promise<void>
  disabled?: boolean

  constructor (options: ModuleOptions) {
    this.id = options.id
    this.name = options.name
    this.routesHandler = options.routesHandler
    this.onEnabled = async (eventId) => Promise.resolve(options.onEnabled && options.onEnabled(eventId))
    this.onDisabled = async (eventId) => Promise.resolve(options.onDisabled && options.onDisabled(eventId))
    this.disabled = options.disabled
  }
}

interface InitOptions {
  advertise?: boolean
}

export async function initializeModules (options: InitOptions = {}) {
  const modules = (await fs.readdir(__dirname)).filter(name =>
    !name.includes('.js.map') && !name.includes('index.')
  )
  const jobs = []

  for (const moduleName of modules) {
    const { default: mod } = await import(path.join(__dirname, moduleName))
    if (!(mod instanceof EventModule)) throw new Error(`Module ${moduleName} is not a valid module`)

    if (mod.disabled) {
      console.log(`Skipping module ${mod.name}`)
      continue
    }

    loadedModules[mod.id] = mod

    if (options.advertise) {
      jobs.push(ModuleInfo.findOneAndUpdate({
        id: mod.id
      }, {
        $setOnInsert: {
          id: mod.id,
          name: mod.name,
          description: '',
          enabled: false
        }
      }, {
        upsert: true,
        new: true
      }))
    }

    const moduleRouter = express.Router({ mergeParams: true })
    mod.routesHandler(moduleRouter)
    ModuleRouter.use(`/${mod.id}`, moduleRouter)
  }

  await Promise.all(jobs)
  console.log(`Loaded ${modules.length - 1} modules`)
}

export function listLoadedModules () {
  return Object.keys(loadedModules)
}

export function getModule (moduleId: string) {
  return loadedModules[moduleId]
}
