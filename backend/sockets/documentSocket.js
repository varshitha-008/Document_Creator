let activeDocuments = {};

function setupDocumentSockets(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a document room
    socket.on('join-document', (documentId) => {
      socket.join(documentId);
      if (!activeDocuments[documentId]) {
        activeDocuments[documentId] = { content: '' };
      }
      socket.emit('load-document', activeDocuments[documentId].content);
    });

    // Handle content changes
    socket.on('send-changes', (documentId, delta) => {
      socket.to(documentId).emit('receive-changes', delta);
    });

    // Handle saving document content
    socket.on('save-document', async (documentId, content) => {
      activeDocuments[documentId].content = content;
      // Here, save the document to the database using mongoose or your controller logic
      // Example: await Document.findByIdAndUpdate(documentId, { content });
      console.log(`Document ${documentId} saved by ${socket.id}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupDocumentSockets };
