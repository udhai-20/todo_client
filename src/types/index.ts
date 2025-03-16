export type Priority = 'low' | 'medium' | 'high';

export interface User {
  _id: string;
  name: string;
  username: string;
  imageUrl: string;
}

export interface Note {
  content: string;
  createdAt: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  user: string; // Refe to User (MongoDB ObjectId)
  tags: string[];
  assignedUsers: string[]; // Array of userNames
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}
