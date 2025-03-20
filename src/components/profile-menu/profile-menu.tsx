import { FC } from 'react';
import { redirect, useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { fetchLogout } from '../../slices/stellar-burger-slice';
import { deleteCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(fetchLogout())
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        }
      });
    redirect('/');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
