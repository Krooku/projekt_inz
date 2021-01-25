import mongoose, { Document, Schema } from 'mongoose'

interface IModulePackage extends Document {
  name: string
  description?: string
  imageUrl?: string
  modules: string[]
}

const ModulePackageSchema = new Schema({
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
  modules: {
    type: [String],
    required: true
  }
}, {
  versionKey: false
})

export default mongoose.model<IModulePackage>('ModulePackage', ModulePackageSchema)
