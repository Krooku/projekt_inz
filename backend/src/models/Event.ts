import mongoose, { Document, Schema } from 'mongoose'

export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  modules: string[]
  cover: mongoose.Types.ObjectId
  customCover?: mongoose.Types.ObjectId
  template?: mongoose.Types.ObjectId
}

const EventSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  modules: {
    type: [String],
    required: true
  },
  cover: {
    type: Schema.Types.ObjectId,
    ref: 'EventCover'
  },
  customCover: {
    type: Schema.Types.ObjectId,
    ref: 'EventCoverCustom'
  },
  template: {
    type: Schema.Types.ObjectId,
    ref: 'ModulePackage'
  }
}, {
  versionKey: false
})

export default mongoose.model<IEvent>('Event', EventSchema)
