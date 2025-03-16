import axios from 'axios';
import { Todo, User } from '../types';

const API_BASE_URL = 'https://todo-server-as6h.onrender.com'; //base url deployed url need to replace here//
// const API_BASE_URL = 'http://localhost:3005'; //base url deployed url need to replace here//

// Function to handle API errors
const handleApiError = (error: unknown, defaultMessage = 'An error occurred') => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error?.response) {
      // Handle different HTTP errors
      switch (error?.response?.status) {
        case 400:
          throw new Error(error?.response?.data?.message || 'Bad request. Please check your input.');
        case 401:
          throw new Error('Unauthorized. Please log in again.');
        case 403:
          throw new Error('Forbidden. You do not have permission.');
        case 404:
          throw new Error('Resource not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error?.response?.data?.message || defaultMessage);
      }
    } else if (error.request) {
      throw new Error('No response from server. Please check your internet connection.');
    }
  } 

  throw new Error(defaultMessage);
};

// Fetch Todos
export const fetchTodos = async (userId:string,page:number,limit:number): Promise<Todo[]|any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos?user=${userId}&page=${page}&limit=${limit}`);
    console.log('Todos', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch todos');
  }
};

// Fetch Users
export const fetchUsers = async (): Promise<User[]|any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    // console.log('response.data:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch users');
  }
};

// Create Todo
export const createTodo = async (todo: Omit<Todo, '_id' | 'createdAt'>): Promise<Todo|any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todos`, todo);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to create todo');
  }
};

// Update Todo
export const updateTodoApi = async (todo: Todo): Promise<Todo|any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/todos/${todo._id}`, todo);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update todo');
  }
};

// Delete Todo
export const deleteTodoApi = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
  } catch (error) {
    handleApiError(error, 'Failed to delete todo');
  }
};

// Add Note to Todo
export const addNoteApi = async (todoId: string, content: string, createdBy: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todos/${todoId}/notes`, { content, createdBy });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to add note');
  }
};
