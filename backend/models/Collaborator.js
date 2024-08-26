const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' }, // Roles: owner, editor, viewer
});

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);
module.exports = Collaborator;
