import mongoose from 'mongoose';

export interface IGrades {
  _id: mongoose.Types.ObjectId;
  grade: Number;
  wordLength: Number;
}

const GradeSchema = new mongoose.Schema<IGrades>(
  {
    grade: { type: Number, required: true },
    wordLength: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: 'Grades',
  }
);

export const GradeModel = mongoose.model<IGrades>('Grade', GradeSchema);
