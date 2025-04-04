import React, { useState } from 'react';
import api from '../api';

export default function RegisterModal({ onClose, onSwitchToLogin, setIsAuthenticated, setUser }) {
  const initialFormState = {
    username: '',
    email: '',
    password1: '',
    password2: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Проверка совпадения паролей
    if (formData.password1 !== formData.password2) {
      setErrorMessage("Пароли не совпадают");
      return;
    }

    // Проверка заполнения полей
    if (!formData.username || !formData.email || !formData.password1) {
      setErrorMessage("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post('/api/register/', formData);

      setSuccessMessage("Регистрация успешна!");

      // Автоматический вход после регистрации
      localStorage.setItem('access_token', response.data.token.access);
      localStorage.setItem('refresh_token', response.data.token.refresh);
      localStorage.setItem('user_data', JSON.stringify(response.data));

      // Обновление состояния аутентификации
      setIsAuthenticated(true);
      setUser(response.data);

      // Очистка формы
      setFormData(initialFormState);

      // Закрыть модальное окно через 2 секунды
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error("Ошибка при регистрации:", error);

      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object') {
          // Ищем первую ошибку в объекте ответа
          const errorField = Object.keys(error.response.data)[0];
          const errorValue = error.response.data[errorField];

          if (Array.isArray(errorValue)) {
            setErrorMessage(errorValue[0]);
          } else if (typeof errorValue === 'string') {
            setErrorMessage(errorValue);
          } else {
            setErrorMessage(`Ошибка в поле ${errorField}`);
          }
        } else {
          setErrorMessage("Ошибка при регистрации");
        }
      } else {
        setErrorMessage("Произошла ошибка при попытке регистрации");
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
            Регистрация
          </h3>

          {errorMessage && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-md">
              {successMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="username"
                />
              </div>
            </div>

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
              <label htmlFor="password1" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1">
                <input
                  id="password1"
                  name="password1"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password1}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                Подтверждение пароля
              </label>
              <div className="mt-1">
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password2}
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
                {isLoading ? "Загрузка..." : "Зарегистрироваться"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Уже есть аккаунт? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}