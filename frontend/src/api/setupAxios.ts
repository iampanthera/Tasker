import axios from 'axios';

const BASE_URL = 'http://localhost:3005/api';

export const request = axios.create({
  baseURL: BASE_URL,
});
