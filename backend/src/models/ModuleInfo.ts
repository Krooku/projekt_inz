import mongoose, { Document, Schema } from 'mongoose'

interface IModuleInfo extends Document {
  id: string
  name: string
  description?: string
  imageUrl?: string
  darkScreenUrl?: string
  lightScreenUrl?: string
  enabled: boolean
  wip: boolean
}

const ModuleInfoSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  darkscreenUrl: {
    type: String
  },
  lightScreenUrl: {
    type: String
  },
  enabled: {
    type: Boolean,
    default: false
  },
  wip: {
    type: Boolean
  }
}, {
  versionKey: false
})

export default mongoose.model<IModuleInfo>('ModuleInfo', ModuleInfoSchema)
