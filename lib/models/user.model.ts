import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  id: string;
  name: string;
  username: string;
  image: string;
  threads: mongoose.Schema.Types.ObjectId[];
  onboarded: boolean;
  bio: string;
  communities: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: String,
  image: String,
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
