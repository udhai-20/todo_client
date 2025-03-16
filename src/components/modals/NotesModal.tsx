import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { Todo } from '../../types';

export const NotesModal: React.FC<{
  todo: Todo;
  onClose: () => void;
}> = ({ todo, onClose }) => {
  const { addNote } = useTodo();
  console.log('todo:', todo.notes);
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      addNote(todo, newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Notes for "{todo.title}"</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 max-h-60 overflow-y-auto space-y-3">
            {todo?.notes?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notes yet</p>
            ) : (
              todo.notes.map(note => (
                <div key={note.content} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">{note.content}</p>
                  <div className="mt-2 text-xs text-gray-500 flex justify-between">
                    {/* <span>@{note.createdBy}</span> */}
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};