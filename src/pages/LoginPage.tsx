import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { AxiosError } from 'axios';
import { FiLogIn } from 'react-icons/fi';


interface LoginResponse {
  token: string;
  username: string;
  email: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      login(response.data);
      navigate('/tasks', { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        setError('Email ou senha inválidos. Por favor, tente novamente.');
      } else {
        setError('Falha ao tentar logar. O servidor pode estar offline.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login - Gerenciador de Tarefas</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-main"
        >
          <FiLogIn />
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
      
      <div className="auth-link">
        <p>
          Não tem uma conta?{' '}
          <Link to="/register">Registre-se aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;