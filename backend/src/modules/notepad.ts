import { EventModule } from './'
import { NoteItem } from '../models'
import { Request, Response } from 'express'

export default new EventModule({
  id: 'notepad',
  name: 'Notatnik',
  routesHandler: (router) => {
    router.get('/', listNoteItems)
    router.post('/', addNoteItem)
    router.get('/:noteId', getNoteItem)
    router.put('/:noteId', editNoteItem)
    router.delete('/:noteId', deleteNoteItem)
  },
  onDisabled: async (eventId) => {
    return NoteItem.deleteMany({ eventId }).exec()
  }
})

async function listNoteItems (req: Request, res: Response) {
  const { eventId } = req.params
  const noteItems = await NoteItem.find({ eventId }, { eventId: 0 }).lean().exec()
  res.status(200).json(noteItems)
}

async function addNoteItem (req: Request, res: Response) {
  const { eventId } = req.params
  const { name, content } = req.body

  if (!name || !content) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const noteItem = new NoteItem({ eventId, name, content })

  try {
    await noteItem.save()
  } catch (error) {
    return res.status(400).json({
      message: 'Nie można stworzyć notatki',
      error: error
    })
  }

  res.status(200).json(noteItem)
}

async function editNoteItem (req: Request, res: Response) {
  const { eventId, noteId } = req.params
  const { name, content } = req.body

  const update: any = {}
  if (name) update.name = name
  if (content) update.content = content

  const noteItem = await NoteItem.findOneAndUpdate({
    _id: noteId,
    eventId
  }, update, {
    new: true,
    runValidators: true
  }).lean().exec()

  if (!noteItem) {
    return res.status(400).json({
      message: 'Notatka nie istnieje lub brak uprawnień'
    })
  }

  res.status(200).json(noteItem)
}

async function getNoteItem (req: Request, res: Response) {
  const { eventId, noteId } = req.params

  const noteItem = await NoteItem.findOne({
    _id: noteId,
    eventId
  }).lean().exec()

  if (!noteItem) {
    return res.status(400).json({
      message: 'Notatka nie istnieje lub brak uprawnień'
    })
  }

  res.status(200).json(noteItem)
}

async function deleteNoteItem (req: Request, res: Response) {
  const { eventId, noteId } = req.params

  const noteItem = await NoteItem.findOne({
    _id: noteId,
    eventId
  }).exec()

  if (!noteItem) {
    return res.status(400).json({
      message: 'Notatka nie istnieje lub brak uprawnień'
    })
  }

  await noteItem.remove()
  res.status(200).end()
}
