import {Schema, model } from 'mongoose';
import mongoose from 'mongoose';
// Define the Document Schema
const documentSchema = new mongoose.Schema({
  documentName: {
    type: String,
    required: true,
  },
  comments: [{
    name: {
      type: String,
      required: false
    },
    comment: {
      type: String,
      required: false
    }
  }],
  noComments:[{
    // type: mongoose.Schema.Types.ObjectId,
    type:String,
    required: false,
  }]
}, {
  timestamps: true,
  }
);

// Ensure no OverwriteModelError by checking if model already exists
const modelName = 'DocumentComments'; // Replace with your model 

const Document = mongoose.models[modelName] || mongoose.model(modelName, documentSchema);
export default Document;




