import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const OrganizationSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  },
  description: {
    type: String,
    trim: true,
    minlength: 10,
    required: true
  },
  uniqueKey: {
    type: String,
    trim: true,
    minlength: 5,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
  },
  departments: [{
    type: Schema.Types.ObjectId, ref: 'Department'
  }],
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

export default mongoose.model('Organization', OrganizationSchema);