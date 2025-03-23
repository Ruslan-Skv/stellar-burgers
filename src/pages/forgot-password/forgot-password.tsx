import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

//Компонент ForgotPassword отвечает за логику восстановления пароля.
export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  //error: Состояние для хранения ошибки
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate(); //Функция для программного перехода на другую страницу.

  //Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null); //Сбрасывает ошибку перед новым запросом.
    forgotPasswordApi({ email }) //Отправляет запрос на сервер для восстановления пароля с введенным email.
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true }); //Если запрос успешен: Сохраняет флаг resetPassword в локальном хранилище,  чтобы разрешить доступ к странице сброса пароля. Перенаправляет пользователя на страницу сброса пароля.
      })
      .catch((err) => setError(err)); //Если запрос завершился ошибкой: Сохраняет ошибку в состоянии error
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
