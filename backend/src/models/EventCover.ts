import mongoose, { Document, Schema } from 'mongoose'

export interface IEventCover extends Document {
  coverUrl: string
  template: mongoose.Types.ObjectId
}

const EventCoverSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  template: {
    type: Schema.Types.ObjectId,
    ref: 'ModulePackage'
  }
}, {
  versionKey: false
})

export default mongoose.model<IEventCover>('EventCover', EventCoverSchema)
