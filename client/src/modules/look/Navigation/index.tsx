// import { Link } from 'react-router-dom';
// import { HashLink as Link } from 'react-router-hash-link';
import styles from './Navigation.module.scss';
import { Link, NavLink } from 'react-router-dom';
import { MouseEvent, useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';

interface NavigationProps {
  themeMode?: any;
  walletConnect?: any;
  close?: any;
}

const Navigation = ({ themeMode, walletConnect, close }: NavigationProps) => {
  const { isAdmin, authToken, isLightMode } = useContext(AppContext);

  return (
    <nav className={styles.Navigation}>
      <div className={styles.Navigation__heading}>
        <h5>Menu</h5>
        <a onClick={close} className={styles.Navigation__close} />
      </div>
      <ul>
        {authToken && (
          <li>
            <NavLink
              style={(isActive) => ({
                fontWeight: isActive ? 'bold' : '',
              })}
              to="/createEvent"
            >
              Create event
            </NavLink>
          </li>
        )}
        {authToken && (
          <li>
            <NavLink
              style={(isActive) => ({
                // color: isActive && !isLightMode ? '#98c063' : isActive && isLightMode ? '#000' : '',
                fontWeight: isActive ? 'bold' : '',
              })}
              to="/manageDrop"
            >
              Manage drop
            </NavLink>
          </li>
        )}
        {authToken && (
          <li>
            <NavLink
              style={(isActive) => ({
                fontWeight: isActive ? 'bold' : '',
              })}
              to="/userNfts"
            >
              Explore Collection
            </NavLink>
          </li>
        )}
        {isAdmin && (
          <li>
            <NavLink
              style={(isActive) => ({
                fontWeight: isActive ? 'bold' : '',
              })}
              to="/events"
            >
              Events
            </NavLink>
          </li>
        )}
      </ul>
      <div
        className={styles.Navigation__themeMode}
        onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}
      >
        <p>Theme:</p>
        {themeMode}
      </div>
      <div className={styles.Navigation__wallet}>{walletConnect}</div>
    </nav>
  );
};

export default Navigation;
