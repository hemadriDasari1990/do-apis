import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const BoardSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    trim: true,
    minlength: 5
  },
  sections: [{
    type: Schema.Types.ObjectId, ref: 'Section'
  }],
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

export default mongoose.model('Board', BoardSchema);