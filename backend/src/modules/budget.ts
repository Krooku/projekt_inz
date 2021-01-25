import { EventModule } from './'
import { BudgetItem } from '../models'
import { IBudgetItem } from '../models/BudgetItem'
import { Request, Response } from 'express'

export default new EventModule({
  id: 'budget',
  name: 'Budżet',
  routesHandler: (router) => {
    router.get('/', listBudgetItems)
    router.post('/', addBudgetItem)
    router.get('/:budgetId', getBudgetItem)
    router.put('/:budgetId', editBudgetItem)
    router.delete('/:budgetId', deleteBudgetItem)
  },
  onDisabled: async (eventId) => {
    return BudgetItem.deleteMany({ eventId }).exec()
  }
})

async function listBudgetItems (req: Request, res: Response) {
  const { eventId } = req.params
  const budgetItems = await BudgetItem.find({ eventId }, { eventId: 0 }).lean().exec()
  res.status(200).json(budgetItems)
}

async function addBudgetItem (req: Request, res: Response) {
  const { eventId } = req.params
  const { name, bought, price } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const budgetItem = new BudgetItem({ eventId, name, bought, price })

  try {
    await budgetItem.save()
  } catch (error) {
    return res.status(400).json({
      message: 'Nie można stworzyć elementu budżetu',
      error: error
    })
  }

  res.status(200).json(budgetItem)
}

async function editBudgetItem (req: Request, res: Response) {
  const { eventId, budgetId } = req.params
  const { name, bought, price } = req.body

  const update: Partial<IBudgetItem> = {}
  if (name) update.name = name
  if (bought || bought === false) update.bought = bought
  if (price !== undefined) update.price = price

  const budgetItem = await BudgetItem.findOneAndUpdate({
    _id: budgetId,
    eventId
  }, update, {
    new: true,
    runValidators: true
  }).lean().exec()

  if (!budgetItem) {
    return res.status(400).json({
      message: 'Element budżetu nie istnieje lub brak uprawnień'
    })
  }

  res.status(200).json(budgetItem)
}

async function getBudgetItem (req: Request, res: Response) {
  const { eventId, budgetId } = req.params

  const budgetItem = await BudgetItem.findOne({
    _id: budgetId,
    eventId
  }).lean().exec()

  if (!budgetItem) {
    return res.status(400).json({
      message: 'Element budżetu nie istnieje lub brak uprawnień'
    })
  }

  res.status(200).json(budgetItem)
}

async function deleteBudgetItem (req: Request, res: Response) {
  const { eventId, budgetId } = req.params

  const budgetItem = await BudgetItem.findOne({
    _id: budgetId,
    eventId
  }).exec()

  if (!budgetItem) {
    return res.status(400).json({
      message: 'Element budżetu nie istnieje lub brak uprawnień'
    })
  }

  await budgetItem.remove()
  res.status(200).end()
}
