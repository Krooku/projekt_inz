import mongoose, { Document, Schema } from 'mongoose'

export interface IFoodItem extends Document {
  eventId: mongoose.Types.ObjectId
  dish: string
  owner: string
}

const FoodItemSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  dish: {
    type: String,
    required: true
  },
  owner: {
    type: String
  }
}, {
  versionKey: false
})

export default mongoose.model<IFoodItem>('FoodItem', FoodItemSchema)
