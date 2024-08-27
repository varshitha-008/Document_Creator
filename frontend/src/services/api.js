// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://document-creator.onrender.com',
});

export default api;
