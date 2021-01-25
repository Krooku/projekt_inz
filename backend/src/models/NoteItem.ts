import mongoose, { Document, Schema } from 'mongoose'

interface INoteItem extends Document {
  eventId: mongoose.Types.ObjectId
  name: string
  content: string
}

const NoteItemSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
})

export default mongoose.model<INoteItem>('NoteItem', NoteItemSchema)
