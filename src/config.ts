// src/config.ts
const API_URL = import.meta.env.vite_API_URL || 'http://localhost:3000/api';

console.log(' Environment:', import.meta.env.MODE);
console.log(' API URL:', API_URL);

export default API_URL;