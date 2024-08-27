import io from 'socket.io-client';

const socket = io('https://document-creator.onrender.com'); // Update to your server URL

export default socket;
