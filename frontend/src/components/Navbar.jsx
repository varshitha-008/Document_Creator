import { Link } from 'react-router-dom';
import { Box, Button, Flex, Spacer, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Flex as="nav" p={4} bg="black" color="white" alignItems="center" w='100vw'>
      <Heading size="lg">Collaborative Editor</Heading>
      <Spacer />
      {isAuthenticated ? (
        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
      ) : (
        <Flex>
          <Link to="/signup">
            <Button colorScheme="teal" mr={4}>Signup</Button>
          </Link>
          <Link to="/login">
            <Button colorScheme="teal">Login</Button>
          </Link>
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
