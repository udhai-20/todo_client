import React, { useEffect, useMemo, useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { Priority, Todo } from '../types';
import { Plus, Filter, MessageSquarePlus, Pencil, Trash2 } from 'lucide-react';
import { AddTodoModal } from './modals/AddTodoModal';
import { NotesModal } from './modals/NotesModal';

export const TodoList: React.FC = () => {
  const { todos, deleteTodo, currentPage, totalPages, nextPage, prevPage } = useTodo();
  console.log('todos:', todos);
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
  const [selectedTodoForNotes, setSelectedTodoForNotes] = useState<Todo | null>(null);
  const [selectedTodoForEdit, setSelectedTodoForEdit] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    // console.log("Recalculating filteredTodos...");
    // console.log('filterTag:', todos.forEach(data=>console.log(data.tags)));
    const trimmedFilterTag = filterTag.trim().toLowerCase();
    return todos
      .filter(todo => filterPriority === 'all' || todo.priority.toLocaleLowerCase() === filterPriority.toLocaleLowerCase())
      .filter(todo =>
        !trimmedFilterTag || (Array.isArray(todo.tags) &&
          todo.tags.some(tag => tag.toLowerCase().includes(trimmedFilterTag))
        )
      )
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }, [todos, filterPriority, filterTag, sortBy]);

  console.log('filteredTodos:', selectedTodoForNotes);
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(id);
    }
  };
  useEffect(() => {
    if (selectedTodoForNotes) {
      const updatedTodo = todos.find(t => t._id === selectedTodoForNotes._id);
      if (updatedTodo) {
        setSelectedTodoForNotes({ ...updatedTodo });
      }
    }
  }, [todos]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          className="sm:hidden flex items-center justify-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          <span>Toggle Filters</span>
        </button>

        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
          <select
            className="rounded-md border border-gray-300 px-3 py-2 bg-white"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="text"
            placeholder="Filter by tag"
            className="rounded-md border border-gray-300 px-3 py-2"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value.toLowerCase())}
          />
          <select
            className="rounded-md border border-gray-300 px-3 py-2 bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddTodoModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          <span>Add Todo</span>
        </button>
      </div>

      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No todos found</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onNotesClick={() => {
                const latestTodo = todos.find(t => t._id === todo._id);
                setSelectedTodoForNotes(latestTodo || todo);
              }}
              onEditClick={() => setSelectedTodoForEdit(todo)}
              onDeleteClick={() => handleDelete(todo._id)}
            />
          ))
        )}
      </div>

      {(isAddTodoModalOpen || selectedTodoForEdit) && (
        <AddTodoModal
          todo={selectedTodoForEdit}
          onClose={() => {
            setIsAddTodoModalOpen(false);
            setSelectedTodoForEdit(null);
          }}
        />
      )}

      {selectedTodoForNotes && (
        <NotesModal
          todo={selectedTodoForNotes}
          onClose={() => setSelectedTodoForNotes(null)}
        />
      )}
      <div>

        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Previous
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

const TodoItem: React.FC<{
  todo: Todo;
  onNotesClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}> = ({ todo, onNotesClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{todo.title}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={onNotesClick}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="View/Add Notes"
            >
              <MessageSquarePlus size={18} className="text-gray-500" />
            </button>
            <button
              onClick={onEditClick}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Edit Todo"
            >
              <Pencil size={18} className="text-blue-500" />
            </button>
            <button
              onClick={onDeleteClick}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Delete Todo"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        </div>
        <span className={`self-start sm:self-center px-2 py-1 rounded-full text-sm ${todo.priority === 'high' ? 'bg-red-100 text-red-800' :
          todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
          {todo.priority}
        </span>
      </div>
      <p className="text-gray-600 mt-2 text-sm sm:text-base">{todo.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {todo.tags.map(tag => (
          <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-xs sm:text-sm">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-gray-500">
        <div className="flex flex-wrap items-center gap-2">
          {todo.assignedUsers.map(username => (
            <span key={username} className="text-blue-500 text-xs sm:text-sm">@{username}</span>
          ))}
        </div>
        <span className="text-xs sm:text-sm">{new Date(todo.createdAt).toLocaleDateString()}</span>
      </div>

    </div>
  );
};