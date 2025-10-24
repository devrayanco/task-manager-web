import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../interfaces/task.interface';
import api from '../services/api';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';


interface TaskCardProps {
  task: Task;
  index: number;
  onTaskDeleted: (taskId: number) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onTaskDeleted, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(task.title);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveTitle = async () => {
    if (!editingTitle.trim()) {
      setError("O título não pode ser vazio.");
      return;
    }
    if (editingTitle.trim() === task.title) {
      setIsEditing(false);
      return;
    }

    setIsMutating(true);
    setError(null);
    try {
      await api.put(
        `/tasks/${task.id}/title`,
        JSON.stringify(editingTitle), 
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      onTaskUpdated({ ...task, title: editingTitle });
      setIsEditing(false);
    } catch (err) {
      setError("Falha ao salvar título.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    setIsMutating(true);
    setError(null);
    try {
      await api.delete(`/tasks/${task.id}`);
      onTaskDeleted(task.id);
    } catch (err) {
      setError("Falha ao excluir.");
      setIsMutating(false);
    }
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps} 
          className={`kanban-card ${snapshot.isDragging ? 'card-is-dragging' : ''}`}
        >
          {isEditing ? (
            <div className="card-content form-inline">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={handleSaveTitle} 
                autoFocus
                className="edit-input"
                disabled={isMutating}
              />
              <button onClick={handleSaveTitle} className="btn btn-sm btn-success" disabled={isMutating}>Salvar</button>
            </div>
          ) : (
            <>
              <div className="card-content">
                <span onDoubleClick={() => setIsEditing(true)} title="Clique duplo para editar">
                  {task.title}
                </span>
                {error && <p className="error-message" style={{ margin: 0 }}>{error}</p>}
              </div>
              <div className="card-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn-success"
                  disabled={isMutating}
                  title="Editar"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-sm btn-danger"
                  disabled={isMutating}
                  title="Excluir"
                >
                  <FiTrash2 />                  
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;