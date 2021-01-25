import { EventModule } from './'
import { FoodItem } from '../models'
import { IFoodItem } from '../models/FoodItem'
import { Request, Response } from 'express'

export default new EventModule({
  id: 'food',
  name: 'Wspólne jedzenie',
  routesHandler: (router) => {
    router.get('/', listFoodItems)
    router.post('/', addFoodItem)
    router.get('/:foodId', getFoodItem)
    router.put('/:foodId', editFoodItem)
    router.delete('/:foodId', deleteFoodItem)
  },
  onDisabled: async (eventId) => {
    return FoodItem.deleteMany({ eventId }).exec()
  }
})

async function listFoodItems (req: Request, res: Response) {
  const { eventId } = req.params
  const foodItems = await FoodItem.find({ eventId }, { eventId: 0 }).lean().exec()
  res.status(200).json(foodItems)
}

async function addFoodItem (req: Request, res: Response) {
  const { eventId } = req.params
  const { dish, owner } = req.body

  if (!dish) {
    return res.status(400).json({
      message: 'Niepełne zapytanie'
    })
  }

  const foodItem = new FoodItem({ eventId, dish, owner })

  try {
    await foodItem.save()
  } catch (error) {
    return res.status(400).json({
      message: 'Nie można stworzyć elementu',
      error: error
    })
  }

  res.status(200).json(foodItem)
}

async function editFoodItem (req: Request, res: Response) {
  const { eventId, foodId } = req.params
  const { dish, owner } = req.body

  const update: Partial<IFoodItem> = {}
  if (dish) update.dish = dish
  if (owner || owner === '') update.owner = owner

  const foodItem = await FoodItem.findOneAndUpdate({
    _id: foodId,
    eventId
  }, update, {
    new: true,
    runValidators: true
  }).lean().exec()

  if (!foodItem) {
    return res.status(400).json({
      message: 'Element nie istnieje lub brak uprawnień'
    })
  }

  res.status(200).json(foodItem)
}

async function getFoodItem (req: Request, res: Response) {
  const { eventId, foodId } = req.params

  const foodItem = await FoodItem.findOne({
    _id: foodId,
    eventId
  }).lean().exec()

  if (!foodItem) {
    return res.status(400).json({
      message: 'Element nie istnieje lub brak uprawnień'
    })
  }

  res.status(200).json(foodItem)
}

async function deleteFoodItem (req: Request, res: Response) {
  const { eventId, foodId } = req.params

  const foodItem = await FoodItem.findOne({
    _id: foodId,
    eventId
  }).exec()

  if (!foodItem) {
    return res.status(400).json({
      message: 'Element nie istnieje lub brak uprawnień'
    })
  }

  await foodItem.remove()
  res.status(200).end()
}
