import mongoose from 'mongoose';

export interface ISchool {
  _id: mongoose.Types.ObjectId;
  name: string;
  active: boolean;
}

const SchoolSchema = new mongoose.Schema<ISchool>(
  {
    name: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    collection: 'Schools',
  }
);

export const SchoolModel = mongoose.model<ISchool>('School', SchoolSchema);
