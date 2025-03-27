import React, { useState } from 'react';
import api from '../api';

export default function LoginModal({ onClose, onSwitchToRegister, setIsAuthenticated, setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Проверка заполнения полей
    if (!formData.email || !formData.password) {
      setErrorMessage("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post('/api/login/', formData);

      // Сохранение токенов в localStorage
      localStorage.setItem('access_token', response.data.token.access);
      localStorage.setItem('refresh_token', response.data.token.refresh);

      // Также сохраняем данные пользователя, чтобы иметь к ним доступ без /api/profile/
      localStorage.setItem('user_data', JSON.stringify(response.data));

      // Обновление состояния аутентификации
      setIsAuthenticated(true);
      setUser(response.data);

      // Закрыть модальное окно
      onClose();
    } catch (error) {
      console.error("Ошибка при входе:", error);

      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          setErrorMessage(error.response.data.detail);
        } else if (typeof error.response.data === 'object') {
          const firstError = Object.values(error.response.data)[0];
          setErrorMessage(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setErrorMessage("Не удалось войти с указанными учетными данными");
        }
      } else {
        setErrorMessage("Произошла ошибка при попытке входа");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Остановить всплытие клика внутри модального окна
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-md mx-4" onClick={stopPropagation}>
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Закрыть</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-6 pb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Вход в систему
          </h3>

          {errorMessage && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {isLoading ? "Загрузка..." : "Войти"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Нет аккаунта? </span>
            <button
              onClick={onSwitchToRegister}
              className="text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}