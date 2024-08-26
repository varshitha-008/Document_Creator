const express = require('express');
const router = express.Router();
const {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  getDocumentHistory,
  revertDocumentVersion,
  addComment,
  getComments,
} = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

// Document Routes
router.get('/', authMiddleware, getDocuments);
router.post('/', authMiddleware, createDocument);
router.put('/:id', authMiddleware, updateDocument);
router.delete('/:id', authMiddleware, deleteDocument);
router.get('/:id', authMiddleware, getDocument);

// Document History Routes
router.get('/:id/history', authMiddleware, getDocumentHistory);
router.post('/:id/revert', authMiddleware, revertDocumentVersion);

// Comment Routes
router.post('/:id/comments', authMiddleware, addComment);
router.get('/:id/comments', authMiddleware, getComments);

module.exports = router;
