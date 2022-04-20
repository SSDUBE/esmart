import mongoose from 'mongoose';

export interface IRole {
  _id: mongoose.Types.ObjectId;
  type: string;
  description: string;
}

const RoleSchema = new mongoose.Schema<IRole>(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'Roles',
  }
);

export const RoleModel = mongoose.model<IRole>('Roles', RoleSchema);
