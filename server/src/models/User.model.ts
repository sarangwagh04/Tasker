import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  USER = "User",
}

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
