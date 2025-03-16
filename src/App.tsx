import React from 'react';
import { TodoProvider } from './context/TodoContext';
import { TodoList } from './components/TodoList';
import { UserSelector } from './components/UserSelector';

function App() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800">Todo Management</h1>
          <UserSelector />
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;