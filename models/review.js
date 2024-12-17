import mongoose from 'mongoose';
// Define the Document Schema
const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
    comments: [{
      type:String,
      required: false,
    }],
  }, {
  timestamps: true,
  
});
// Ensure no OverwriteModelError by checking if model already exists
const modelName = 'reviews'; // Replace with your model 
const Document = mongoose.models[modelName] || mongoose.model(modelName, documentSchema);
export default Document;
