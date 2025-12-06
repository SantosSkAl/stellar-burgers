import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onLogoClick,
  isLogoPlaying
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>

      {/* <Link to='/' className={styles.logo}>
        <Logo className='' />
      </Link> */}

      <div className={styles.logo} onClick={onLogoClick}>
        <Logo className={isLogoPlaying ? styles.logo_playing : ''} />
      </div>

      <NavLink
        to='/profile'
        className={({ isActive }) =>
          `${styles.link_position_last} ${styles.link} ${isActive ? styles.link_active : ''}`
        }
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
