import mongoose, { Document, Schema } from 'mongoose'

interface ITodoPackage extends Document {
  name: string
  description?: string
  todos: [
    {
      name: string
      priority: number
    }
  ]
  template?: string
}

const TodoPackageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  todos: [
    {
      name: {
        type: String,
        required: true
      },
      priority: {
        type: Number,
        default: 0
      }
    }
  ],
  template: {
    type: Schema.Types.ObjectId,
    ref: 'ModulePackage'
  }
}, {
  versionKey: false
})

export default mongoose.model<ITodoPackage>('TodoPackage', TodoPackageSchema)
