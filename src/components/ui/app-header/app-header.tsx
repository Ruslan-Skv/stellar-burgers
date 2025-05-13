import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  // const location = useLocation();

  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {/* Блок с иконкой бургера и текстом "Конструктор" */}
        <>
          <BurgerIcon type={'primary'} />
          <Link
            to='/'
            className={
              location.pathname === '/' ? styles.link_active : styles.link
            }
          >
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
        </>
        {/* Блок с иконкой списка и текстом "Лента заказов" */}
        <>
          <ListIcon type={'primary'} />
          <Link
            to='/feed'
            className={
              location.pathname.includes('feed')
                ? styles.link_active
                : styles.link
            }
          >
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </>
      </div>
      {/* Центральная часть меню с логотипом */}
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      {/* Правая часть меню с иконкой профиля и именем пользователя */}
      <div className={styles.link_position_last}>
        <ProfileIcon type={'primary'} /> {/* Иконка профиля */}
        <Link
          to='/profile'
          className={
            location.pathname.includes('profile')
              ? styles.link_active
              : styles.link
          }
        >
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </div>
    </nav>
  </header>
);
