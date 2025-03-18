import { Schema, model } from 'mongoose';

const dataSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DataModel = model('Data', dataSchema);

export default DataModel;