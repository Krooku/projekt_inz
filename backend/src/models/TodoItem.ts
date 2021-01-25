import mongoose, { Document, Schema } from 'mongoose'

interface ITodoItem extends Document {
  eventId: mongoose.Types.ObjectId
  name: string
  status: string
}

const TodoItemSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo',
    required: true
  }
}, {
  versionKey: false
})

export default mongoose.model<ITodoItem>('TodoItem', TodoItemSchema)
