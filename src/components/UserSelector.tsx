import React from 'react';
import { useTodo } from '../context/TodoContext';

export const UserSelector: React.FC = () => {
  const { users, currentUser,handleUserChange } = useTodo();

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 sm:mb-6">
      <h2 className="text-lg font-semibold mb-4">Switch User</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {users.map(user => (
          <button
            key={user._id}
            onClick={() => handleUserChange(user)}
            className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors ${
              currentUser&&currentUser._id === user._id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            <img
              src={user.imageUrl}
              alt={user.username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
            />
            <span className="text-xs sm:text-sm font-medium text-center line-clamp-1">{user.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
};