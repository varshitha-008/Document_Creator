import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentEditor from './DocumentEditor';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  useToast,
  StackDivider,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const Dashboard = ({ user }) => {
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [newDocName, setNewDocName] = useState('');
  const toast = useToast();

  // Fetch documents when the component mounts
  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem('token');
  
      try {
        const response = await axios.get('https://document-creator.onrender.com/api/documents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (Array.isArray(response.data)) {
          setDocuments(response.data);
        } else {
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
  
    fetchDocuments();
  }, []);
  

  // Function to create a new document
  const createDocument = async () => {
    const token = localStorage.getItem('token');

    if (!newDocName.trim()) {
      return toast({
        title: 'Error',
        description: 'Document name cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    const documentData = {
      name: newDocName,
      content: 'Sample content',
    };

    try {
      const response = await axios.post(
        'https://document-creator.onrender.com/api/documents',
        documentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDocuments([...documents, response.data]);
      setNewDocName('');
      toast({
        title: 'Success',
        description: 'Document created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating document:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to delete a document
  const deleteDocument = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://document-creator.onrender.com/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(documents.filter((doc) => doc._id !== id));
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting document:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to rename a document
  const renameDocument = (id, newName) => {
    const token = localStorage.getItem('token');
    axios
      .patch(
        `https://document-creator.onrender.com/api/documents/${id}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDocuments(
          documents.map((doc) => (doc._id === id ? response.data : doc))
        );
      })
      .catch((error) =>
        console.error('Error renaming document:', error.response?.data || error.message)
      );
  };

  return (
    <HStack spacing={4} align="start" p={4}>
      <VStack
        w="25%"
        p={4}
        bg="gray.100"
        rounded="md"
        shadow="md"
        divider={<StackDivider borderColor="gray.300" />}
        spacing={4}
      >
        <VStack w="100%" spacing={2}>
          <Input
            placeholder="Document name"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
          />
          <Button
            leftIcon={<FaPlus />}
            colorScheme="teal"
            onClick={createDocument}
            w="100%"
          >
            Create New Document
          </Button>
        </VStack>

        <VStack w="100%" spacing={2} align="stretch" overflowY="auto">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Box
                key={doc._id}
                p={4}
                bg="white"
                shadow="sm"
                rounded="md"
                _hover={{ bg: 'teal.50', cursor: 'pointer' }}
                onClick={() => setActiveDocument(doc)}
              >
                <HStack justify="space-between">
                  <Text fontWeight="bold">{doc.name}</Text>
                  <HStack>
                    <IconButton
                      size="sm"
                      icon={<FaEdit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt('New name:', doc.name);
                        if (newName) renameDocument(doc._id, newName);
                      }}
                    />
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      icon={<FaTrash />}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc._id);
                      }}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))
          ) : (
            <Text>No documents found.</Text>
          )}
        </VStack>
      </VStack>

      <Box w="75%" p={4} bg="gray.50" rounded="md" shadow="md">
        {activeDocument ? (
          <DocumentEditor document={activeDocument} user={user} />
        ) : (
          <Text>Select a document to edit</Text>
        )}
      </Box>
    </HStack>
  );
};

export default Dashboard;
