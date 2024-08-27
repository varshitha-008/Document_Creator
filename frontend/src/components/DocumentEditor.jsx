import React, { useState, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import socket from '../socket';
import axios from 'axios';
import CollaboratorsList from './CollaboratorsList';
import VersionHistory from './VersionHistory';

const DocumentEditor = ({ document, user }) => {
  const [editor, setEditor] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link'],
        ],
      },
    });
    setEditor(quill);

    // Join the document
    socket.emit('join-document', document._id);
    console.log("document id .............................",document._id)

    // Load document content
    socket.on('load-document', (content) => {
      quill.root.innerHTML = content;
    });

    // Receive live changes from other collaborators
    socket.on('receive-changes', (delta) => {
      quill.updateContents(delta);
    });

    // Update collaborators list
    socket.on('update-collaborators', (collaboratorList) => {
      setCollaborators(collaboratorList);
    });

    // Load document version history
    socket.on('document-history', (versions) => {
      setHistory(versions);
    });

    return () => {
      socket.off('load-document');
      socket.off('receive-changes');
      socket.off('update-collaborators');
      socket.off('document-history');
    };
  }, [document._id]);

  // Emit text changes to the server for real-time collaboration
  useEffect(() => {
    if (editor && document && document._id) {
      editor.on('text-change', (delta) => {
        socket.emit('send-changes', document._id, delta);
      });
  
      // Auto-save content every 10 seconds
      const interval = setInterval(() => {
        handleAutoSave(); // Auto-save function
      }, 10000);
  
      return () => {
        clearInterval(interval);
      };
    }
  }, [editor, document]);
  

  // Handle manual save on button click
  const handleSave = async () => {
    const content = editor.root.innerText;
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `https://document-creator.onrender.com/api/documents/${document._id}/save`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Document saved successfully.');
    } catch (error) {
      console.error('Failed to save document:', error);
      alert('Failed to save document.');
    }
  };

  // Auto-save functionality (without alert)
  const handleAutoSave = async () => {
    const content = editor.root.innerText;
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `https://document-creator.onrender.com/api/documents/${document._id}/save`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleRevertVersion = async (versionId) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        `https://document-creator.onrender.com/api/documents/${document._id}/revert`,
        { version: versionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Get the reverted content and update the editor
      const revertedContent = response.data.revertedContent;
      editor.root.innerHTML = revertedContent;
  
      alert('Document reverted to selected version.');
    } catch (error) {
      console.error('Failed to revert document version:', error);
      alert('Failed to revert document version.');
    }
  };
  

  return (
    <div>
      <div id="editor" style={{ height: '500px' }}></div>
      <button id='btn' onClick={handleSave}>Save</button>
      <CollaboratorsList collaborators={collaborators} />
      <VersionHistory versions={history} onRevert={handleRevertVersion} />
    </div>
  );
};

export default DocumentEditor;
