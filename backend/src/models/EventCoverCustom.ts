import mongoose, { Document, Schema } from 'mongoose'

export interface IEventCoverCustom extends Document {
  userId: Schema.Types.ObjectId
  imageUrl: string
}

const EventCoverCustomSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  versionKey: false
})

export default mongoose.model<IEventCoverCustom>('EventCoverCustom', EventCoverCustomSchema)
