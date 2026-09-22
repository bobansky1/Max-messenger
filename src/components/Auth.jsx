import { useState } from 'react';
import './Auth.css';

function Auth({ onAuth }) {
  const [idInstance, setIdInstance] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!idInstance.trim() || !apiToken.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);

    try {
      // Проверяем валидность учетных данных для MAX
      const response = await fetch(
        `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiToken}`
      );

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      const data = await response.json();
      
      if (data.stateInstance) {
        onAuth(idInstance, apiToken);
      } else {
        setError('Не удалось подключиться. Проверьте данные.');
      }
    } catch (err) {
      setError('Ошибка авторизации. Проверьте правильность данных.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>MAX Messenger</h1>
          <p>Войдите с помощью GREEN-API</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="idInstance">ID Instance</label>
            <input
              type="text"
              id="idInstance"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              placeholder="Введите ID Instance"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apiToken">API Token</label>
            <input
              type="text"
              id="apiToken"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="Введите API Token"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Подключение...' : 'Войти'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Нет учетной записи?{' '}
            <a
              href="https://green-api.com/max/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Зарегистрироваться
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
