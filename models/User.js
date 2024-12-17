import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
  role: [{
      type: String,
      enum: ["User", "Reviewer", "Approver"],
      required: true,
    }],

  status: {
      type: String,
      enum: ["Active", "InActive","Created"],
      required: true,
    },
  password: {
    type: String,
    required: false,
  },
  wrongPassword: {
    type: Number,
    default: 0,
  },
  wrongAttempts:{
    type:Number,
    default:0
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
