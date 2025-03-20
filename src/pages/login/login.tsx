import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchLoginUser,
  removeErrorText,
  selectErrorText,
  selectLoading
} from '../../slices/stellar-burger-slice';
import { Preloader } from '../../components/ui/preloader';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectErrorText);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(removeErrorText());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(removeErrorText());
    const values = { email, password };
    dispatch(fetchLoginUser(values))
      .unwrap()
      .then((payload) => {
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
