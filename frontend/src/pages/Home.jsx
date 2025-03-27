import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

export default function Home({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  // Если пользователь авторизован, перенаправляем на профиль
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl w-full px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 mb-4">
              <span className="block">Interfaces that made</span>
              <span className="block">the technology <span className="font-medium">Natural</span></span>
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Современные интерфейсы с естественным взаимодействием
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openLoginModal}
              className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-full text-sm font-medium transition-all hover:bg-gray-800"
            >
              Вход в систему
            </button>
            <button
              onClick={openRegisterModal}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black border border-gray-300 rounded-full text-sm font-medium transition-all hover:bg-gray-50"
            >
              Регистрация
            </button>
          </div>

          <div className="mt-24 text-center">
            <p className="text-xs text-gray-500">
              © 2025 МойСайт. Все права защищены.
            </p>
          </div>
        </div>
      </main>

      {/* Модальные окна */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={closeModals}
          onSwitchToRegister={openRegisterModal}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />
      )}

      {isRegisterModalOpen && (
        <RegisterModal
          onClose={closeModals}
          onSwitchToLogin={openLoginModal}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />
      )}
    </div>
  );
}