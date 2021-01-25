import mongoose, { Document, Schema } from 'mongoose'

export interface IBudgetItem extends Document {
  eventId: mongoose.Types.ObjectId
  name: string
  bought: boolean
  price: number
}

const BudgetItemSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  bought: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false
})

export default mongoose.model<IBudgetItem>('BudgetItem', BudgetItemSchema)
