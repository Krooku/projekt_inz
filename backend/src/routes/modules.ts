import * as ModuleManager from '../modules'
import { ModulePackage, ModuleInfo, Event } from '../models'
import { Request, Response, NextFunction } from 'express'

export async function list (req: Request, res: Response) {
  const loadedModules = ModuleManager.listLoadedModules()
  const moduleInfos = await ModuleInfo.find({ enabled: true }, { _id: 0 }).exec()
  const enabledModules = moduleInfos.filter(mod => loadedModules.includes(mod.id))

  res.status(200).json(enabledModules)
}

export async function get (req: Request, res: Response) {
  const { moduleId } = req.params
  const moduleLoaded = ModuleManager.listLoadedModules().includes(moduleId)

  if (!moduleLoaded) {
    return res.status(404).json({
      message: 'Module does not exist'
    })
  }

  const moduleInfo = await ModuleInfo.findOne({
    id: moduleId
  }, {
    _id: 0
  }).lean().exec()

  if (!moduleInfo) {
    return res.status(501).json({
      message: 'Module info is not available'
    })
  }

  res.status(200).json(moduleInfo)
}

export async function listPackages (req: Request, res: Response) {
  const packages = await ModulePackage.find().lean().exec()
  res.status(200).json(packages)
}

export async function verifyModuleEnabled (req: Request, res: Response, next: NextFunction) {
  const userId = req.session && req.session.user.id
  const { eventId, moduleId } = req.params

  if (!ModuleManager.listLoadedModules().includes(moduleId)) {
    return res.status(400).json({
      errorCode: 0,
      message: `Module ${moduleId} does not exist`
    })
  }

  const event = await Event.findOne({
    _id: eventId
  }).exec()

  if (!event) {
    return res.status(400).json({
      errorCode: 1,
      message: `Event ${eventId} does not exist`
    })
  }

  if (!event.userId.equals(userId)) {
    return res.status(401).end()
  }

  if (!event.modules.includes(moduleId)) {
    return res.status(400).json({
      errorCode: 2,
      message: `Module ${moduleId} is not enabled on event ${eventId}`
    })
  }

  next()
}

export async function listEventModules (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params

  const [event, modules] = await Promise.all([
    Event.findOne({ _id: eventId }).exec(),
    ModuleInfo.find({}, { _id: 0 }).exec()
  ])

  if (!event) {
    return res.status(404).json({
      message: 'Event does not exist'
    })
  }

  if (!event.userId.equals(userId)) {
    return res.status(401).end()
  }

  const enabledModules = modules.filter(mod => event.modules.includes(mod.id))

  res.status(200).json(enabledModules)
}

export async function enableModuleOnEvent (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params
  const { module: mod } = req.body

  if (!mod) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const modules = ModuleManager.listLoadedModules()
  if (!modules.includes(mod)) {
    return res.status(400).json({
      message: 'Module does not exist'
    })
  }

  const event = await Event.findOne({
    _id: eventId
  }).exec()

  if (!event) {
    return res.status(404).json({
      message: 'Event not found in database'
    })
  }

  if (!event.userId.equals(userId)) {
    return res.status(401).end()
  }

  if (event.modules.includes(mod)) {
    return res.status(200).json({
      message: 'Module already enabled'
    })
  }

  event.modules.push(mod)
  await event.save()
  res.status(200).end()
}

export async function disableModuleOnEvent (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params
  const { module: mod } = req.body

  if (!mod) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const modules = ModuleManager.listLoadedModules()
  if (!modules.includes(mod)) {
    return res.status(400).json({
      message: 'Module does not exist'
    })
  }

  const event = await Event.findOne({
    _id: eventId
  }).exec()

  if (!event) {
    return res.status(500).json({
      message: 'Module missing from database'
    })
  }

  if (!event.userId.equals(userId)) {
    return res.status(401).end()
  }

  if (!event.modules.includes(mod)) {
    return res.status(200).json({
      message: 'Module already disabled'
    })
  }

  const index = event.modules.indexOf(mod)
  event.modules.splice(index, 1)

  const jobs: Array<Promise<any>> = [event.save()]
  const modObj = ModuleManager.getModule(mod)
  if (modObj) jobs.push(modObj.onDisabled(eventId))

  await Promise.all(jobs)

  res.status(200).end()
}
