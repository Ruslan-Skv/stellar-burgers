import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUpdateUser,
  selectLoading,
  selectUser
} from '../../slices/stellar-burger-slice';
import { Preloader } from '../../components/ui/preloader';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectLoading);
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  // Используем хук useEffect для синхронизации формы с данными пользователя
  useEffect(() => {
    // Обновляем состояние формы, если данные пользователя изменились
    setFormValue((prevState) => ({
      ...prevState, // Сохраняем предыдущие значения формы
      name: user?.name || '', // Обновляем имя, если оно есть
      email: user?.email || '' // Обновляем email, если он есть
    }));
  }, [user]); // Зависимость: эффект срабатывает при изменении user

  // Проверяем, были ли изменены данные формы по сравнению с исходными данными пользователя
  const isFormChanged =
    formValue.name !== user?.name || // Имя изменилось
    formValue.email !== user?.email || // Email изменился
    !!formValue.password; // Пароль был введен

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchUpdateUser(formValue));
  };

  // Обработчик отмены изменений
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Сбрасываем форму к исходным данным пользователя
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  // Обработчик изменения значений в полях ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Обновляем состояние формы при изменении значений полей
    setFormValue((prevState) => ({
      ...prevState, // Сохраняем предыдущие значения
      [e.target.name]: e.target.value // Обновляем значение поля по его имени
    }));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue} // Текущие значения формы
      isFormChanged={isFormChanged} // Флаг, указывающий, были ли изменены данные
      handleCancel={handleCancel} // Функция для отмены изменений
      handleSubmit={handleSubmit} // Функция для отправки формы
      handleInputChange={handleInputChange} // Функция для обработки изменений в полях ввода
    />
  );
};
