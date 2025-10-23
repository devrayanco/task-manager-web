import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { Task } from '../interfaces/task.interface';
import TaskCard from './TaskCard';

interface Column {
  id: string;
  title: string;
  taskIds: number[];
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskDeleted: (taskId: number) => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  tasks, 
  onTaskDeleted, 
  onTaskUpdated 
}) => {
  return (
    <Droppable key={column.id} droppableId={column.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="kanban-column"
        >
          <h3 className="column-title">{column.title}</h3>
          <div 
            className={`column-droppable-area ${snapshot.isDraggingOver ? 'column-dragging-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onTaskDeleted={onTaskDeleted}
                onTaskUpdated={onTaskUpdated}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;