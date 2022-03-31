import mongoose from 'mongoose';

export interface ISchool {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const SchoolSchema = new mongoose.Schema<ISchool>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'schools',
  }
);

export const SchoolModel = mongoose.model<ISchool>('School', SchoolSchema);
