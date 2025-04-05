import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api'; // API-функция для сброса пароля
import { ResetPasswordUI } from '@ui-pages'; // UI-компонент для отображения формы сброса

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null); // Сбрасываем ошибку перед выполнением запроса
    // Вызываем API-функцию для сброса пароля
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword'); // Если запрос успешен, удаляем флаг сброса пароля из localStorage
        navigate('/login'); // Перенаправляем пользователя на страницу входа
      })
      .catch((err) => setError(err)); // Если произошла ошибка, сохраняем её в состоянии
  };

  // Используем хук useEffect для проверки доступа к странице
  useEffect(() => {
    // Проверяем, есть ли в localStorage флаг сброса пароля
    if (!localStorage.getItem('resetPassword')) {
      // Если флага нет, перенаправляем пользователя на страницу восстановления пароля
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
