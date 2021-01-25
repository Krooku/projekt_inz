import mongoose, { Document, Schema } from 'mongoose'

type GuestStatus = 'invite' | 'invited' | 'confirmed'

interface IGuestItem extends Document {
  eventId: mongoose.Types.ObjectId
  firstname: string
  lastname: string
  phoneNumber: string
  email: string
  plusOne: boolean
  plusOneFullName?: string
  status: GuestStatus
}

const GuestItemSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String
  },
  plusOne: {
    type: Boolean,
    default: false
  },
  plusOneFullName: {
    type: String
  },
  status: {
    type: String,
    enum: ['invite', 'invited', 'confirmed'],
    default: 'invite',
    required: true
  }
}, {
  versionKey: false
})

export default mongoose.model<IGuestItem>('GuestItem', GuestItemSchema)
