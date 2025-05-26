import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must be at most 20 characters"],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },

    phoneNumbers: {
      type: [String],
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one phone number is required",
      },
      required: true,
    },
    addresses: {
      type: [String],
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one address is required",
      },
      required: true,
    },
    age: {
      type: Number,
      min: [18, "User must be at least 18 years old"],
      max: [100, "User must be less than or equal to 100 years old"],
    },

    isLoggedIn: {
      type: Boolean,
      default: false,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
