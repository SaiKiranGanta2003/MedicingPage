import mongoose, { model } from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    EmployeeID: {
      type: String,
      unique: true,
      required: true,
    },
    Department: {
      type: String,
      required: true,
    },
    Designation: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Converts email to lowercase before saving
    },
    role: [
      {
        type: String,
        enum: ["User", "Reviewer", "Approver"],

        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["Active", "InActive", "Created"],
      deafault:"Created",
      required: true,
    },
    password: {
      type: String,
      default: '',
      required: false,
    },
    wrongAttempts: {
      type: Number,
      default: 0,
    },
    wrongPassword: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
  {
    update: {
      type: Date,
      default: Date.now,
    },
  }
);
export default mongoose.model("User", userSchema);
