import { FC } from 'react';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { fetchLogout } from '../../slices/stellar-burger-slice';
import { deleteCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(fetchLogout())
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          localStorage.removeItem('refreshToken'); // Удаляем refreshToken
          deleteCookie('accessToken'); // Удаляем accessToken
          navigate('/'); // Редирект на главную страницу
        }
      })
      .catch((error) => {
        console.error('Ошибка при выходе:', error);
        // Если произошла ошибка, всё равно очищаем токены и состояние
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        navigate('/'); // Редирект на главную страницу
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
