import { request } from './setupAxios';

export const register = async (authData: any) => {
  try {
    const response = await request.post('/auth/register', authData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (authData: any) => {
  try {
    const response = await request.post('/auth/login', authData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
