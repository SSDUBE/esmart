import mongoose from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  created_by?: mongoose.Types.ObjectId,
  updated_by?: mongoose.Types.ObjectId,
  first_name?: string;
  last_name?: string;
  id_number: string;
  contact_number?: string;
  email?: string;
  password: string;
  role_id: mongoose.Types.ObjectId;
  school_id: mongoose.Types.ObjectId;
  active: boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    first_name: { type: String },
    last_name: { type: String },
    contact_number: { type: String },
    id_number: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    school_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    active: { type: Boolean, required: true, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId},
    updated_by: { type: mongoose.Schema.Types.ObjectId},
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export const UserModel = mongoose.model<IUser>('Users', UserSchema);
