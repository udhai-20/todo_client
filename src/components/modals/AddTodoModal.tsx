import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { Priority, Todo } from '../../types';

export const AddTodoModal: React.FC<{
  todo?: Todo | null;
  onClose: () => void;
}> = ({ todo, onClose }) => {
  const { addTodo, updateTodo,currentUser } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>("medium");
  const [tags, setTags] = useState('');
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setTags(todo.tags.join(', '));
      setAssignedUsers(todo.assignedUsers);
    } else {
      // For new todos, automatically assign the current user
      console.log('currentUser:', currentUser);
      setAssignedUsers(currentUser ? [currentUser.username] : []);
    }
  }, [todo, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todoData = {
      title,
      description,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      assignedUsers,
      notes: todo?.notes || [],
      createdBy: currentUser?.username || '',
    };

    if (todo) {
      updateTodo({ ...todo, ...todoData });
    } else {
      addTodo({
        ...todoData,
        completed: false,
        user: currentUser?._id || '',
        updatedAt: new Date().toISOString(),
      
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">{todo ? 'Edit Todo' : 'Add New Todo'}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g., urgent, feature, bug"
            />
          </div>

          {/* {todo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Additional Users
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {users.length&&users.map(user => (
                  <label key={user._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={assignedUsers.includes(user.username)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignedUsers([...assignedUsers, user.username]);
                        } else {
                          setAssignedUsers(assignedUsers.filter(u => u !== user.username));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{user.name} (@{user.username})</span>
                  </label>
                ))}
              </div>
            </div>
          )} */}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {todo ? 'Update Todo' : 'Create Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};