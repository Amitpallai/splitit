import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface ITrip extends Document {
  tripName: string;
  location: string;
  creator: mongoose.Types.ObjectId | IUser;
  participants: (mongoose.Types.ObjectId | IUser)[];
  guestParticipants: string[];
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    tripName: { type: String, required: true },
    location: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }], // registered users
    guestParticipants: [{ type: String }], // plain strings
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>("Trip", tripSchema);
