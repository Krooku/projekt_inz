import mongoose, { Document, Schema, Query } from 'mongoose'
import { hashPassword } from '../services/crypto'

type UserRole = 'member' | 'admin'

export interface IUser extends Document {
  email: string
  username: string
  password: string
  role: UserRole
  isVerified?: boolean
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false,
  timestamps: true
})

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next()

  const hashed = await hashPassword(this.password)
  this.password = hashed

  next()
})

const beforeUpdate: mongoose.HookSyncCallback<Query<IUser>> = async function (next) {
  const update = this.getUpdate()
  const newPassword = update && update.password

  if (!newPassword) return next()

  this.update({}, { password: await hashPassword(newPassword) })

  next()
}

UserSchema.pre('update', beforeUpdate)
UserSchema.pre('findOneAndUpdate', beforeUpdate)
UserSchema.pre('updateOne', beforeUpdate)

export default mongoose.model<IUser>('User', UserSchema)
