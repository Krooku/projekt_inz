import mongoose, { Document, Schema } from 'mongoose'

interface ITableItem extends Document {
  eventId: mongoose.Types.ObjectId
  guests: [mongoose.Types.ObjectId]
}

const TableItemSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  guests: [{
    type: Schema.Types.ObjectId,
    ref: 'GuestItem'
  }]
}, {
  versionKey: false
})

export default mongoose.model<ITableItem>('TableItem', TableItemSchema)
