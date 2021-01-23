import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const LikeSchema = new Schema({
  noteId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Note',
    required: true,
    index: true
  }
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

export default mongoose.model('Like', LikeSchema);