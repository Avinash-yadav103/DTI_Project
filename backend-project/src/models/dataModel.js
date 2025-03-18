const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;