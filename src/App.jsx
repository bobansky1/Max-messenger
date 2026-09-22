import { useState } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    idInstance: '',
    apiToken: '',
  });

  const handleAuth = (idInstance, apiToken) => {
    setCredentials({ idInstance, apiToken });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ idInstance: '', apiToken: '' });
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth onAuth={handleAuth} />
      ) : (
        <Chat
          idInstance={credentials.idInstance}
          apiToken={credentials.apiToken}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
