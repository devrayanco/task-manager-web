import React from 'react';
import { DragDropContext, type OnDragEndResponder } from '@hello-pangea/dnd';
import type { Task } from '../interfaces/task.interface';
import KanbanColumn from './KanbanColumn';

interface Column {
  id: string;
  title: string;
  taskIds: number[];
}
interface BoardState {
  tasks: { [taskId: number]: Task };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}

interface KanbanBoardProps {
  board: BoardState;
  onDragEnd: OnDragEndResponder;
  onTaskDeleted: (taskId: number) => void;
  onTaskUpdated: (updatedTask: Task) => void;
  moveError: string | null;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  board,
  onDragEnd,
  onTaskDeleted,
  onTaskUpdated,
  moveError
}) => {
  return (
    <> {}
      {moveError && <p className="error-message">{moveError}</p>}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {board.columnOrder.map(columnId => {
            const column = board.columns[columnId];
            const tasksInColumn = column.taskIds.map(taskId => board.tasks[taskId]);

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasksInColumn}
                onTaskDeleted={onTaskDeleted}
                onTaskUpdated={onTaskUpdated}
              />
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;