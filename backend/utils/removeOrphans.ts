import connectDatabase from '../src/db'
import { Model as ModelInterface } from 'mongoose'
import * as models from '../src/models'

const items = [
  'TableItem',
  'BudgetItem',
  'FoodItem',
  'GuestItem',
  'NoteItem',
  'TodoItem'
]

;(async () => {
  const db = await connectDatabase()
  await cleanEvents()
  await cleanItems()

  db.disconnect()
})()

async function cleanEvents () {
  console.log('Searching events')
  const events = await models.Event.find({}, 'userId name').populate('userId').exec()
  const orphaned = events.filter(e => !e.userId)

  console.log(`Found ${orphaned.length} orphaned events`)
  console.log(orphaned.map(e => e.name))
  if (orphaned.length === 0) return

  const ids = orphaned.map(e => e._id)
  await models.Event.deleteMany({
    _id: ids
  })
}

async function cleanItems () {
  for (const item of items) {
    const model = (models as any)[item] as ModelInterface<any, {}>
    if (!model) {
      console.log(`Warging: Item ${item} not found`)
      continue
    }

    const elems = await model.find({}, 'eventId').populate('eventId').exec()
    const orphaned = elems.filter(i => !i.eventId)
    console.log(`${item}: Found ${orphaned.length} orphaned items`)
    if (orphaned.length === 0) continue

    const ids = orphaned.map(e => e._id)
    await model.deleteMany({
      _id: ids
    })
  }
}