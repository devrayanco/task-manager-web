// src/pages/TasksPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { Task } from '../interfaces/task.interface';
import type { OnDragEndResponder } from '@hello-pangea/dnd';

// Importa os NOVOS componentes
import CreateTaskForm from '../components/CreateTaskForm';
import KanbanBoard from '../components/KanbanBoard';

// --- Definimos os tipos de estado aqui, pois é a fonte da verdade ---
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
const initialBoardState: BoardState = {
  tasks: {},
  columns: {
    "ToDo": { id: "ToDo", title: "A Fazer", taskIds: [] },
    "InProgress": { id: "InProgress", title: "Em Andamento", taskIds: [] },
    "Done": { id: "Done", title: "Concluído", taskIds: [] },
  },
  columnOrder: ["ToDo", "InProgress", "Done"],
};

const TasksPage: React.FC = () => {
  const { authData, logout } = useAuth();
  
  const [board, setBoard] = useState(initialBoardState);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoadingList(true);
      setListError(null);
      try {
        const response = await api.get<Task[]>('/tasks');
        const tasksFromApi = response.data;

        const tasksMap = tasksFromApi.reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {} as { [taskId: number]: Task });

        const newColumns = { ...initialBoardState.columns };
        newColumns.ToDo.taskIds = [];
        newColumns.InProgress.taskIds = [];
        newColumns.Done.taskIds = [];

        tasksFromApi.forEach(task => {
          if (newColumns[task.status]) {
            newColumns[task.status].taskIds.push(task.id);
          }
        });

        setBoard({
          tasks: tasksMap,
          columns: newColumns,
          columnOrder: initialBoardState.columnOrder
        });

      } catch (err) {
        setListError('Falha ao carregar tarefas.');
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setBoard(prev => {
      const newTasks = { ...prev.tasks, [newTask.id]: newTask };
      const todoColumn = prev.columns['ToDo'];
      const newTodoTaskIds = [newTask.id, ...todoColumn.taskIds];
      const newTodoColumn = { ...todoColumn, taskIds: newTodoTaskIds };
      return {
        ...prev,
        tasks: newTasks,
        columns: { ...prev.columns, [newTodoColumn.id]: newTodoColumn }
      };
    });
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setBoard(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [updatedTask.id]: updatedTask }
    }));
  };
  
  const handleTaskDeleted = (taskId: number) => {
    setBoard(prev => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      const newColumns = { ...prev.columns };
      for (const columnId in newColumns) {
        newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(id => id !== taskId);
      }
      return { ...prev, tasks: newTasks, columns: newColumns };
    });
  };

  const onDragEnd: OnDragEndResponder = async (result) => {
    const { destination, source, draggableId } = result;
    setMoveError(null);
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = Number(draggableId);
    const startColumn = board.columns[source.droppableId];
    const endColumn = board.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, taskId);
      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setBoard(prev => ({ ...prev, columns: { ...prev.columns, [newColumn.id]: newColumn }}));
      return;
    }

    const previousBoard = board;
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = { ...startColumn, taskIds: startTaskIds };
    const endTaskIds = Array.from(endColumn.taskIds);
    endTaskIds.splice(destination.index, 0, taskId);
    const newEndColumn = { ...endColumn, taskIds: endTaskIds };
    const task = board.tasks[taskId];
    const newStatus = newEndColumn.id; 
    const updatedTask = { ...task, status: newStatus };

    setBoard(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: updatedTask,
      },
      columns: {
        ...prev.columns,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      },
    }));


    try {
      await api.put(`/tasks/${taskId}/status`, 
        newStatus, { headers: {
            'Content-Type': 'application/json' 
          }
        }
      );
    } catch (err) {
      console.error("Falha ao atualizar status:", err);
      setMoveError("Não foi possível mover a tarefa. Verifique sua conexão.");
      setBoard(previousBoard);
    }
  };

  return (
    <div className="kanban-board-container">
      <header className="header">
        <div>
          <h1>Minhas Tarefas (Kanban)</h1>
          <p>Bem-vindo, {authData?.username}!</p>
        </div>
        <button onClick={logout} className="btn btn-danger">Sair</button>
      </header>

      <main>
        {}
        <CreateTaskForm onTaskCreated={handleTaskCreated} />
        
        {listError && <p className="error-message">{listError}</p>}
        {isLoadingList ? (
          <p>Carregando quadro...</p>
        ) : (
          <KanbanBoard
            board={board}
            onDragEnd={onDragEnd}
            onTaskDeleted={handleTaskDeleted}
            onTaskUpdated={handleTaskUpdated}
            moveError={moveError}
          />
        )}
      </main>
    </div>
  );
};

export default TasksPage;