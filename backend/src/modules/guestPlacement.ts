import { EventModule } from './'
import { TableItem } from '../models'
import { Request, Response } from 'express'

export default new EventModule({
  id: 'guestPlacement',
  name: 'Rozmieszczenie Gości',
  routesHandler: (router) => {
    router.get('/', listTableItems)
    router.post('/', addTableItem)
    router.get('/:tableId', getTableItem)
    router.put('/:tableId', editTableItem)
    router.delete('/:tableId', deleteTableItem)
  },
  onDisabled: async (eventId) => {
    return TableItem.deleteMany({ eventId }).exec()
  }
})

async function listTableItems (req: Request, res: Response) {
  const { eventId } = req.params
  const tableItems = await TableItem.find({ eventId }, { eventId: 0 }).lean().populate('guests').exec()
  res.status(200).json(tableItems)
}

async function addTableItem (req: Request, res: Response) {
  const { eventId } = req.params
  const { guests } = req.body

  if (!guests) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const tableItem = new TableItem({
    eventId, guests
  })

  try {
    await tableItem.save()
  } catch (error) {
    return res.status(400).json({
      message: 'Could not create table'
    })
  }

  res.status(200).json(tableItem)
}

async function editTableItem (req: Request, res: Response) {
  const { eventId, tableId } = req.params
  const { guests } = req.body

  if (!guests) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const updateQuery = {
    guests
  }

  const tableItem = await TableItem.findOneAndUpdate({
    _id: tableId,
    eventId
  }, updateQuery, {
    new: true
  }).lean().exec()

  if (!tableItem) {
    return res.status(400).json({
      message: 'Table does not exist or no permission'
    })
  }
  res.status(200).json(tableItem)
}

async function getTableItem (req: Request, res: Response) {
  const { eventId, tableId } = req.params

  const tableItem = await TableItem.findOne({
    _id: tableId,
    eventId
  }, {
    eventId: 0
  }).lean().exec()

  if (!tableItem) {
    return res.status(400).json({
      message: 'Table does not exist or no permission'
    })
  }

  res.status(200).json(tableItem)
}

async function deleteTableItem (req: Request, res: Response) {
  const { eventId, tableId } = req.params

  const tableItem = await TableItem.findOne({
    _id: tableId,
    eventId
  }).exec()

  if (!tableItem) {
    return res.status(400).json({
      message: 'Table does not exist or no permission'
    })
  }

  await tableItem.remove()
  res.status(200).end()
}
