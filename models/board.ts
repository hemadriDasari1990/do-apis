import mongoose from 'mongoose';

delete mongoose.connection.models['Board'];

const Schema = mongoose.Schema;
const BoardSchema = new Schema({
  projectId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project',
    required: true,
    index: true
  },
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
  sprint: {
    type: Number,
    default: 0
  },
  duration: {
    type: String
  },
  sections: [{
    type: Schema.Types.ObjectId, ref: 'Section'
  }],
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

BoardSchema.index({projectId: 1, title: 1}, {unique: true});

export default mongoose.model('Board', BoardSchema);