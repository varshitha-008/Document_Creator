const Collaborator = require('../models/Collaborator.js');
const Document = require('../models/Document.js');

const activeDocuments = {}; // This will store document content and other info for active documents

function setupDocumentSockets(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a document room
    socket.on('join-document', async (documentId) => {
      socket.join(documentId);

      // Initialize document if not already
      if (!activeDocuments[documentId]) {
        activeDocuments[documentId] = { content: '', history: [], Collaborators: [] };
      }

      // Load document content
      socket.emit('load-document', activeDocuments[documentId].content);

      // Load document history
      const doc = await Document.findById(documentId);
      if (doc) {
        socket.emit('document-history', doc.history);
      }

      // Load Collaborators
      const collaborators = await Collaborator.find({ documentId }).populate('userId');
      activeDocuments[documentId].Collaborators = collaborators;
      socket.emit('update-Collaborators', collaborators);

      // Notify other users
      socket.to(documentId).emit('update-Collaborators', collaborators);
    });

    // Handle content changes
    socket.on('send-changes', (documentId, delta, userId) => {
      // Ensure activeDocuments and Collaborators are initialized before accessing
      if (activeDocuments[documentId] && activeDocuments[documentId].Collaborators) {
        const collaboratorColor = activeDocuments[documentId].Collaborators.find(c => c.userId.toString() === userId)?.color || '#000000';
        socket.to(documentId).emit('receive-changes', { delta, userId, color: collaboratorColor });
      } else {
        console.error(`Document or Collaborators not initialized for documentId: ${documentId}`);
      }
    });

    // Handle saving document content
    socket.on('save-document', async (documentId, content) => {
      activeDocuments[documentId].content = content;

      // Save document to the database
      await Document.findByIdAndUpdate(documentId, { content });

      console.log(`Document ${documentId} saved by ${socket.id}`);
    });

    // Handle updating document history
    socket.on('update-history', async (documentId, versionData) => {
      const doc = await Document.findById(documentId);
      if (doc) {
        doc.history.push(versionData);
        await doc.save();
        io.to(documentId).emit('document-history', doc.history);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Optionally handle cleanup of activeDocuments or Collaborators here if necessary
    });
  });
}

module.exports = { setupDocumentSockets };
