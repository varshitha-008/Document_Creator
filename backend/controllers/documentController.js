const Document = require('../models/Document');
const Comment = require('../models/Comment');

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new document
// Create a new document
// Create a new document
exports.createDocument = async (req, res) => {
  try {
    // Validate that content is not empty
    if (!req.body.content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const documentData = {
      name: req.body.name,
      content: req.body.content,
      createdBy: req.user.id,  // Make sure to pass the logged-in user's ID here
    };

    const document = new Document(documentData);

    document.history.push({
      version: 1,
      content: document.content,  // Assume content is validated
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("error in creating from backend", error);
  }
};



// Update a document
exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    document.history.push({
      version: document.history.length + 1,
      content: document.content,
    });

    document.content = req.body.content;
    document.lastModified = Date.now();

    await document.save();
    res.json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a document by ID
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get document history
exports.getDocumentHistory = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document.history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Revert to a previous version
exports.revertDocumentVersion = async (req, res) => {
  try {
    const { version } = req.body;
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const historyEntry = document.history.find(entry => entry.version === version);
    if (!historyEntry) return res.status(404).json({ message: 'Version not found' });

    document.content = historyEntry.content;
    document.lastModified = Date.now();
    await document.save();

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a document
exports.addComment = async (req, res) => {
  try {
    const comment = new Comment({
      documentId: req.params.id,
      ...req.body,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get comments for a document
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ documentId: req.params.id });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
