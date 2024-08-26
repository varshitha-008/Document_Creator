const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
  history: [
    {
      version: { type: Number, required: true },
      content: { type: String, default: '' },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  lastModified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', documentSchema);
