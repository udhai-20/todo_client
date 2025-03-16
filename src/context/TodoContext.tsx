import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Todo, User } from '../types';
import {
  fetchTodos,
  fetchUsers,
  createTodo,
  updateTodoApi,
  deleteTodoApi,
} from '../http/action';

interface TodoContextType {
  todos: Todo[];
  currentUser: User | null;
  users: User[];
  currentPage: number;
  totalPages: number;
  setCurrentUser: (user: User) => void;
  addTodo: (todo: Omit<Todo, '_id' | 'createdAt'>) => Promise<void>;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  addNote: (todo: Todo, content: string) => void;
  handleUserChange: (user: User) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; 

  const loadTodos = useCallback(async (userId: string, page = 1) => {
    try {
      const { todos: todosData, total } = await fetchTodos(userId, page, limit);
      console.log('todosData:', todosData,total);
      setTodos(todosData);
      setTotalPages(Math.ceil(total/limit));
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      alert('Error fetching todos. Please try again.');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
        setCurrentUser(usersData[0]); 
        await loadTodos(usersData[0]._id, currentPage);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Error fetching data! Please try again later.');
      }
    };
    loadData();
  }, [loadTodos, currentPage]);

  const addTodo = useCallback(async (todo: Omit<Todo, '_id' | 'createdAt'>) => {
    try {
      const newTodo = await createTodo(todo);
      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo. Please try again.');
    }
  }, []);

  const updateTodo = useCallback(async (updatedTodo: Todo) => {
    try {
      const newTodo = await updateTodoApi(updatedTodo);
      setTodos(prev => prev.map(todo => (todo._id === newTodo._id ? newTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo. Please check your network and try again.');
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      await deleteTodoApi(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo. Please try again.');
    }
  }, []);

  const addNote = useCallback(async (todo: Todo, content: string) => {
    if (!currentUser) {
      alert('Please select a user first.');
      return;
    }
    try {
      const newNote = {
        content,
        createdAt: new Date().toISOString(),
      };

      const updatedTodo = {
        ...todo,
        notes: [...(todo.notes || []), newNote], // Ensure notes is always an array
      };

      const response = await updateTodoApi(updatedTodo);
      console.log('response:', response);
      setTodos(prev => prev.map(t => (t._id === response._id ? response : t)));
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    }
  }, [currentUser]);

  const handleUserChange = useCallback(async (user: User) => {
    setCurrentUser(user);
    setCurrentPage(1); // Reset to first page when changing user
    await loadTodos(user._id, 1);
  }, [loadTodos]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        currentUser,
        users,
        currentPage,
        totalPages,
        setCurrentUser,
        addTodo,
        updateTodo,
        deleteTodo,
        addNote,
        handleUserChange,
        nextPage,
        prevPage
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
