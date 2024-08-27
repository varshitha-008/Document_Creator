import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Textarea,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  List,
  ListItem,
  Text,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const DocumentEditorWithComments = ({ documentId, user }) => {
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [newComment, setNewComment] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const quillRef = useRef(null);
  const toast = useToast();

  
  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }]],
      },
    });

    // Capture selected text to comment on
    quill.on('selection-change', (range) => {
      if (range && range.length > 0) {
        setSelectedText(quill.getText(range.index, range.length));
      } else {
        setSelectedText('');
      }
    });
  }, []);

  // Add a new comment/suggestion
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      text: selectedText,
      comment: newComment,
      user: user.name,
    };

    setComments((prev) => [...prev, newCommentObj]);


    setNewComment('');
    onClose();
    toast({
      title: 'Comment added successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  
  const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
    toast({
      title: 'Comment deleted.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={4} align="stretch" p={5}>
      <Heading size="lg">Document Editor with Comments</Heading>

      {/* Quill.js Editor */}
      <Box ref={quillRef} style={{ height: '400px' }} />

      {/* Comments Section */}
      <VStack spacing={4} align="stretch" mt={6}>
        <Heading size="md">Comments & Suggestions</Heading>

        {/* Comment List */}
        <List spacing={3}>
          {comments.map((comment) => (
            <ListItem key={comment.id}>
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="bold">{comment.user}</Text>
                  <Text fontStyle="italic">"{comment.text}"</Text>
                  <Text>{comment.comment}</Text>
                </Box>
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete comment"
                  onClick={() => handleDeleteComment(comment.id)}
                />
              </HStack>
            </ListItem>
          ))}
        </List>

        {/* Add Comment Button */}
        {selectedText && (
          <Button colorScheme="blue" onClick={onOpen}>
            Add Comment
          </Button>
        )}

        {/* Add Comment Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Comment or Suggestion</ModalHeader>
            <ModalBody>
              <Textarea
                placeholder="Add your comment or suggestion here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddComment}>
                Add
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </VStack>
  );
};

export default DocumentEditorWithComments;
