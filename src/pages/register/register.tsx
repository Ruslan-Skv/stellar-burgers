import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchRegisterUser,
  getUserThunk,
  removeErrorText,
  selectErrorText,
  selectLoading
} from '../../slices/stellar-burger-slice';
import { setCookie } from '../../utils/cookie';
import { Preloader } from '../../components/ui/preloader';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectErrorText);

  useEffect(() => {
    dispatch(removeErrorText());
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      fetchRegisterUser({
        name: userName,
        password: password,
        email: email
      })
    )
      .unwrap()
      .then((payload) => {
        localStorage.setItem('refreshToken', payload.refreshToken);
        setCookie('accessToken', payload.accessToken);
        dispatch(getUserThunk()); // Запрашиваем данные пользователя
      })
      .catch((error) => {
        console.error('Ошибка при авторизации:', error);
      });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
