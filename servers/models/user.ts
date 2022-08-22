import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    userName: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    authWith: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    twitterHandle: {
      type: String,
    },
  },

  { timestamps: true }
);

const users =
  mongoose.models.User || mongoose.model("User", UserSchema, "User");
export default users;
