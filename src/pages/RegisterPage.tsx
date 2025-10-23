import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
      });

      setSuccess("Registro realizado com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response && axiosError.response.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('Falha ao tentar registrar.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro de Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
            placeholder="Mínimo de 6 caracteres"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !!success}
          className="btn btn-success"
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
      
      <div className="auth-link">
        <p>
          Já tem uma conta?{' '}
          <Link to="/login">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;