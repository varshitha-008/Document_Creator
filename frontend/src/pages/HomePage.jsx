import React from 'react';
import { Box, SimpleGrid, Heading, Text, Icon, VStack } from '@chakra-ui/react';
import { FaFileAlt, FaEdit, FaUserFriends, FaLock } from 'react-icons/fa';

const HomePage = () => {
  return (
    <Box p={8} textAlign="center">
      <Heading mb={8}>Welcome to Document Collaboration Platform</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
        {/* Card 1 */}
        <VStack 
          bg="gray.100" 
          p={6} 
          borderRadius="lg" 
          shadow="md"
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Icon as={FaFileAlt} boxSize={12} color="teal.500" />
          <Heading size="md">Create Documents</Heading>
          <Text>Create and manage your documents with ease.</Text>
        </VStack>

        {/* Card 2 */}
        <VStack 
          bg="gray.100" 
          p={6} 
          borderRadius="lg" 
          shadow="md"
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Icon as={FaEdit} boxSize={12} color="teal.500" />
          <Heading size="md">Edit and Collaborate</Heading>
          <Text>Edit documents in real-time and collaborate with your team.</Text>
        </VStack>

        {/* Card 3 */}
        <VStack 
          bg="gray.100" 
          p={6} 
          borderRadius="lg" 
          shadow="md"
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Icon as={FaUserFriends} boxSize={12} color="teal.500" />
          <Heading size="md">Invite Collaborators</Heading>
          <Text>Share documents and invite others to collaborate in real-time.</Text>
        </VStack>

        {/* Card 4 */}
        <VStack 
          bg="gray.100" 
          p={6} 
          borderRadius="lg" 
          shadow="md"
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Icon as={FaLock} boxSize={12} color="teal.500" />
          <Heading size="md">Secure and Private</Heading>
          <Text>Your data is safe with us, protected by industry-standard encryption.</Text>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;
