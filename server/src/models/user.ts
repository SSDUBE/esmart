import mongoose from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId,
  updatedBy?: mongoose.Types.ObjectId,
  firstName?: string;
  lastName?: string;
  idNumber: string;
  contactNumber?: string;
  email?: string;
  password: string;
  roleId: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId | null;
  roleType: string;
  schoolName?: string | null;
  active: boolean;
  grade?: number;
  gradeId?: mongoose.Types.ObjectId;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    contactNumber: { type: String },
    grade: { type: String },
    email: { type: String },
    schoolName: { type: String },
    idNumber: { type: String, required: true, unique: true },
    roleType: { type: String, required: true },
    password: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId },
    active: { type: Boolean, required: true, default: true },
    gradeId: { type: mongoose.Schema.Types.ObjectId },
    createdBy: { type: mongoose.Schema.Types.ObjectId},
    updatedBy: { type: mongoose.Schema.Types.ObjectId},
  },
  {
    timestamps: true,
    collection: 'Users',
  }
);

export const UserModel = mongoose.model<IUser>('Users', UserSchema);
