import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import RegisterPage from './pages/RegisterPage';

function App() {
  const { authData, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando aplicação...</div>;
  }

  return (
    <Routes>
      {}
      <Route 
        path="/" 
        element={
          authData 
            ? <Navigate to="/tasks" replace />
            : <Navigate to="/login" replace />
        } 
      />

      {}
      <Route 
        path="/login" 
        element={
          authData 
            ? <Navigate to="/tasks" replace />
            : <LoginPage /> 
        } 
      />
      
<Route 
        path="/register" 
        element={
          authData 
            ? <Navigate to="/login" replace />
            : <RegisterPage /> 
        } 
      />

      {}
      <Route element={<ProtectedRoute />}>
        {}
        <Route path="/tasks" element={<TasksPage />} />
        {}
      </Route>
      {}
      <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
    </Routes>
  );
}

export default App;