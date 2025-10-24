import React, { useState } from 'react';
import api from '../services/api';
import type { Task } from '../interfaces/task.interface';
import { FiPlus } from 'react-icons/fi';


interface CreateTaskFormProps {
  onTaskCreated: (newTask: Task) => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreated }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    setCreateError(null);
    try {
      const response = await api.post<Task>('/tasks', { title: newTaskTitle });
      
      setNewTaskTitle('');
      
      onTaskCreated(response.data);

    } catch (err) {
      setCreateError('Falha ao criar tarefa.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="form-section">
      <h2>Adicionar Nova Tarefa</h2>
      <form onSubmit={handleCreateTask} className="form-inline">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="O que precisa ser feito?"
          disabled={isCreating}
        />
        <button
          type="submit"
          disabled={isCreating}
          className="btn btn-main"
        >
          <FiPlus />
          {isCreating ? 'Adicionando...' : 'Adicionar'}
        </button>
      </form>
      {createError && <p className="error-message">{createError}</p>}
    </section>
  );
};

export default CreateTaskForm;