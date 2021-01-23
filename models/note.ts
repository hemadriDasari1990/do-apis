import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const NoteSchema = new Schema({
  sectionId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Section',
    required: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    minlength: 5
  },
  likes : [
    { type: Schema.Types.ObjectId, ref: 'Like' }
  ]
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

export default mongoose.model('Note', NoteSchema);