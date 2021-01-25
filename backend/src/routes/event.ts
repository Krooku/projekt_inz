import { Event, ModulePackage, EventCover, EventCoverCustom } from '../models'
import * as ModuleManager from '../modules'
import { Request, Response } from 'express'
import multer from 'multer'
import { promises as fs } from 'fs'
import path from 'path'

const customCoverUpload = multer({
  dest: 'static/covers/'
})

export async function createEvent (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { name, packageId } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  let modules

  if (packageId) {
    const pack = await ModulePackage.findOne({
      _id: packageId
    }).exec()

    if (!pack) {
      return res.status(400).json({
        message: 'Package does not exist'
      })
    }

    const loadedModules = ModuleManager.listLoadedModules()
    modules = pack.modules.filter(mod => loadedModules.includes(mod))
  }

  const covers = await EventCover.find()
  if (covers.length === 0) {
    return res.status(500).json({
      message: 'Event covers missing'
    })
  }
  const randomCoverIndex = Math.floor(Math.random() * covers.length)
  const randomCoverId = covers[randomCoverIndex]._id

  const event = new Event({ userId, name, modules, cover: randomCoverId, template: packageId })

  try {
    await event.save()
  } catch (error) {
    return res.status(500).json({
      message: 'Database error'
    })
  }

  res.status(200).json(event)
}

export async function getEvent (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params

  const event = await Event.findOne({
    _id: eventId
  })
    .populate('cover customCover')
    .exec()

  if (!event) {
    return res.status(404).json({
      message: 'Event does not exist'
    })
  }

  if (!event.userId.equals(userId)) {
    return res.status(401).end()
  }

  res.status(200).json(event)
}

export async function updateEvent (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params
  const { name } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const event = await Event.findOneAndUpdate({
    _id: eventId,
    userId
  }, {
    name
  }, {
    new: true
  }).exec()

  if (!event) {
    res.status(400).json({
      message: 'Event does not exist or no permission'
    })
  }

  res.status(200).json(event)
}

export async function listCovers (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params
  const event = await Event.findOne({
    _id: eventId,
    userId
  }, 'template').lean().exec()

  if (!event) {
    return res.status(400).json({
      message: 'Event does not exist or no permission'
    })
  }

  const covers = await EventCover.find({
    template: event.template
  }).lean().exec()
  res.status(200).json(covers)
}

export async function listCustomCovers (req: Request, res: Response) {
  const userId = req.session && req.session.user.id

  const covers = await EventCoverCustom.find({
    userId
  }).lean().exec()
  res.json(covers)
}

export async function updateCover (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      message: 'No cover selected'
    })
  }

  const cover = await EventCover.findById(id).exec()
  if (!cover) {
    return res.status(404).json({
      message: 'Selected cover does not exist'
    })
  }

  const event = await Event.findOneAndUpdate({
    _id: eventId,
    userId
  }, {
    cover: id,
    customCover: null
  }, {
    new: true
  }).exec()

  if (!event) {
    res.status(400).json({
      message: 'Event does not exist or no permission'
    })
  }

  res.status(204).end()
}

export function addCustomCover (req: Request, res: Response) {
  const userId = req.session && req.session.user.id

  const upload = customCoverUpload.single('cover')
  upload(req, res, async (err) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please select an image to upload'
      })
    } else if (err) {
      return res.status(400).send(err)
    }

    const absolutePath = path.join('/', req.file.path)

    const customCover = await EventCoverCustom.create({
      userId,
      imageUrl: absolutePath
    })

    res.json(customCover)
  })
}

export async function removeCustomCover (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { id } = req.params

  const cover = await EventCoverCustom.findOneAndDelete({
    userId,
    _id: id
  })
  if (!cover) {
    return res.status(400).json({
      message: 'Custom cover does not exist or no permission'
    })
  }

  try {
    await fs.unlink(cover.imageUrl)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      return res.status(500).json({
        message: 'Failed to delete custom cover file'
      })
    }
  }

  res.status(204).end()
}

export async function updateCustomCover (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params
  const { id } = req.body

  const event = await Event.findOneAndUpdate({
    _id: eventId,
    userId
  }, {
    customCover: id
  }, {
    new: true
  }).exec()

  if (!event) {
    res.status(400).json({
      message: 'Event does not exist or no permission'
    })
  }

  res.status(204).end()
}

export async function deleteEvent (req: Request, res: Response) {
  const userId = req.session && req.session.user.id
  const { eventId } = req.params

  const event = await Event.findOne({
    _id: eventId
  }).exec()

  if (!event) {
    return res.status(404).json({
      message: 'Event does not exist'
    })
  }

  if (!event.userId.equals(userId)) {
    return res.status(401).end()
  }

  const jobs = []
  for (var moduleId of event.modules) {
    const mod = ModuleManager.getModule(moduleId)
    if (mod) {
      jobs.push(mod.onDisabled(eventId))
    }
  }
  await Promise.all(jobs)

  await event.remove()

  res.status(200).end()
}

export async function listEvents (req: Request, res: Response) {
  const userId = req.session && req.session.user.id

  const event = await Event.find({
    userId
  }, {
    userId: 0
  }, {
    sort: {
      _id: -1
    }
  })
    .populate('cover customCover')
    .exec()

  res.status(200).json(event)
}
