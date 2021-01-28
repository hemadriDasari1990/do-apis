// Importing Node packages required for schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//= ===============================
// Feedback Schema
//= ===============================
const FeedbackSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  like: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  });

export default mongoose.model('Feedback', FeedbackSchema);
