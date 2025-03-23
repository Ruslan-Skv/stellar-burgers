import {
  selectIsAuthenticated,
  selectIsInit
} from '../../slices/stellar-burger-slice';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInit = useSelector(selectIsInit);
  const location = useLocation();

  // Проверка на инициализацию приложения
  if (!isInit) {
    return <Preloader />;
  }

  // Если пользователь не аутентифицирован и маршрут защищен
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если пользователь аутентифицирован, но маршрут доступен только для неаутентифицированных
  if (onlyUnAuth && isAuthenticated) {
    const from = (location.state && location.state.from) || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
