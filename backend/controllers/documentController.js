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
// exports.revertDocumentVersion = async (req, res) => {
//   try {
//     const { version } = req.body;
//     const document = await Document.findById(req.params.id);
//     if (!document) return res.status(404).json({ message: 'Document not found' });

//     const historyEntry = document.history.find(entry => entry.version === version);
//     if (!historyEntry) return res.status(404).json({ message: 'Version not found' });

//     document.content = historyEntry.content;
//     document.lastModified = Date.now();
//     await document.save();

//     res.json(document);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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


// Update document content
exports.updateDocumentContent = async (req, res) => {
  try {
    const { content } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Push the current content to history before updating
    document.history.push({
      version: document.history.length + 1,
      content: document.content, // Previous content saved in history
    });

    // Update the document with the new content
    document.content = content;
    document.lastModified = Date.now();

    await document.save();

    res.status(200).json({ message: 'Document content updated successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document content', error });
  }
};


// Get collaborators for a document
exports.getDocumentCollaborators = async (req, res) => {
  try {
    const collaborators = await Collaborator.find({ documentId: req.params.id }).populate('userId');
    res.json(collaborators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.revertDocumentVersion = async (req, res) => {
  const { documentId } = req.params;
  const { version } = req.body;

  try {
    // Find the document by ID
    const document = await Document.findById(documentId);

    // Check if the document exists
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // Check if the document has history
    if (!document.history || document.history.length === 0) {
      return res.status(400).json({ message: 'No version history found for this document.' });
    }

    // Get the selected version's content
    const revertedVersion = document.history.find(v => v._id.toString() === version);

    // Check if the specified version exists in the history
    if (!revertedVersion) {
      return res.status(400).json({ message: 'Specified version not found.' });
    }

    // Revert document to the selected version
    document.content = revertedVersion.content;

    // Save the document with the reverted content
    await document.save();

    // Send the reverted content back to the client
    res.json({ revertedContent: revertedVersion.content });
  } catch (error) {
    console.error('Failed to revert document version:', error);
    res.status(500).json({ message: 'Failed to revert document version.' });
  }
};