import { EventModule } from './'
import { TodoItem, TodoPackage, Event } from '../models'
import { Request, Response } from 'express'

export default new EventModule({
  id: 'todo',
  name: 'Lista zadań',
  routesHandler: (router) => {
    router.get('/', listTodoItems)
    router.post('/', addTodoItem)
    router.get('/packages', listTodoPackages)
    router.post('/import', importTodoPackage)
    router.get('/:todoId', getTodoItem)
    router.put('/:todoId', editTodoItem)
    router.delete('/:todoId', deleteTodoItem)
  },
  onDisabled: async (eventId) => {
    return TodoItem.deleteMany({ eventId }).exec()
  }
})

async function listTodoItems (req: Request, res: Response) {
  const { eventId } = req.params
  const todoItems = await TodoItem.find({ eventId }, { eventId: 0 }).lean().exec()
  res.status(200).json(todoItems)
}

async function addTodoItem (req: Request, res: Response) {
  const { eventId } = req.params
  const { name, status = 'todo', priority = 0 } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Incomplete request'
    })
  }

  const todoItem = new TodoItem({ eventId, name, status, priority })

  try {
    await todoItem.save()
  } catch (error) {
    return res.status(400).json({
      message: 'Could not create todo',
      error: error
    })
  }

  res.status(200).json(todoItem)
}

async function editTodoItem (req: Request, res: Response) {
  const { eventId, todoId } = req.params
  const { name, status, priority } = req.body

  const update: any = {}
  if (name) update.name = name
  if (status) update.status = status
  if (typeof priority !== 'undefined') update.priority = priority

  const todoItem = await TodoItem.findOneAndUpdate({
    _id: todoId,
    eventId
  }, update, {
    new: true,
    runValidators: true
  }).lean().exec()

  if (!todoItem) {
    return res.status(400).json({
      message: 'Todo does not exist or no permission'
    })
  }

  res.status(200).json(todoItem)
}

async function getTodoItem (req: Request, res: Response) {
  const { eventId, todoId } = req.params

  const todoItem = await TodoItem.findOne({
    _id: todoId,
    eventId
  }).lean().exec()

  if (!todoItem) {
    return res.status(400).json({
      message: 'Todo does not exist or no permission'
    })
  }

  res.status(200).json(todoItem)
}

async function deleteTodoItem (req: Request, res: Response) {
  const { eventId, todoId } = req.params

  const todoItem = await TodoItem.findOne({
    _id: todoId,
    eventId
  }).exec()

  if (!todoItem) {
    return res.status(400).json({
      message: 'Todo does not exist or no permission'
    })
  }

  await todoItem.remove()
  res.status(200).end()
}

async function listTodoPackages (req: Request, res: Response) {
  const { eventId } = req.params
  const [todoPackages, event] = await Promise.all([
    TodoPackage.find().exec(),
    Event.findById(eventId).exec()
  ])

  if (!todoPackages) return res.status(500).end()

  if (!event) {
    return res.status(400).json({
      message: 'Nie znaleziono wydarzenia'
    })
  }

  res.status(200).json(
    event.template
      ? todoPackages.filter(p => !p.template || p.template.toString() === event.template!.toHexString())
      : todoPackages
  )
}

async function importTodoPackage (req: Request, res: Response) {
  const { packageId } = req.body
  const { eventId } = req.params

  if (!packageId) {
    return res.status(400).json({
      message: 'Nie podano id paczki'
    })
  }

  const todoPackage = await TodoPackage.findOne({
    _id: packageId
  }).exec()
  if (!todoPackage) {
    return res.status(400).json({
      message: 'Wybrana paczka nie istnieje'
    })
  }

  const event = await Event.countDocuments({
    _id: eventId
  }).exec()
  if (event === 0) {
    return res.status(400).json({
      message: 'Wybrane wydarzenie nie istnieje'
    })
  }

  const todos = todoPackage.todos.map(t => new TodoItem({
    name: t.name,
    status: 'todo',
    priority: t.priority,
    eventId: eventId
  }))

  await TodoItem.collection.insertMany(todos)
  res.status(200).json(todos)
}
