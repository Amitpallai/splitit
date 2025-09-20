import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  trip: mongoose.Types.ObjectId;
  amount: number;
  title: string;
  description?: string;
  paidBy: string;  
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    amount: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    paidBy: { type: String, required: true }, // store string (username/guest)
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
