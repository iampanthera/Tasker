import { request } from './setupAxios';

interface Filters {
  skip: number;
  limit: number;
  searchQuery: string;
  filters: { status: string; priority: number };
}

export const createTask = async (taskData: any, authToken: string) => {
  try {
    if (authToken) {
      request.defaults.headers.common['Authorization'] = authToken;
    }
    const response = await request.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllTask = async (queryFilters: Filters, authToken: string) => {
  try {
    const { skip, limit, searchQuery, filters } = queryFilters;
    if (authToken) {
      request.defaults.headers.common['Authorization'] = authToken;
    }
    const response = await request.get(
      `/tasks/?skip=${skip}&limit=${limit}&q=${searchQuery}&priorityFilter=${filters.priority}&statusFilter=${filters.status}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id: string, authToken: string) => {
  try {
    if (authToken) {
      request.defaults.headers.common['Authorization'] = authToken;
    }
    const response = await request.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editTask = async (
  id: string,
  taskData: any,
  authToken: string
) => {
  try {
    if (authToken) {
      request.defaults.headers.common['Authorization'] = authToken;
    }
    const response = await request.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
