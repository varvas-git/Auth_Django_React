import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './App.css';
import api from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (token) {
        try {
          // Настройка заголовка Authorization
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Получение данных пользователя из localStorage (временное решение)
          // В идеале здесь должен быть запрос к API для получения данных пользователя
          const userData = JSON.parse(localStorage.getItem('user_data'));
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Если данных пользователя нет, но токен есть, мы всё равно считаем пользователя авторизованным
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Передаем состояние аутентификации и пользователя всем компонентам
  const authProps = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    isLoading
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home {...authProps} />} />
        <Route
          path="/profile"
          element={
            isAuthenticated ?
              <Profile {...authProps} /> :
              <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;