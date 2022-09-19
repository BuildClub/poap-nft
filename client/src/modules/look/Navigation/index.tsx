// import { Link } from 'react-router-dom';
// import { HashLink as Link } from 'react-router-hash-link';
import styles from './Navigation.module.scss';
import { Link, NavLink } from 'react-router-dom';
import { MouseEvent, useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';

interface NavigationProps {
  themeMode?: any;
}

const Navigation = ({ themeMode }: NavigationProps) => {
  const { isAdmin } = useContext(AppContext);

  return (
    <nav className={styles.Navigation}>
      <div className={styles.Navigation__heading}>
        <h5>Menu</h5>
        <a className={styles.Navigation__close} />
      </div>
      <ul>
        {/* <li>
        <a href="https://rad.live/on-demand" target="_blank">
          On Demand
        </a>
      </li>
      <li>
        <a href="https://rad.live/live-tv" target="_blank">
          Live TV
        </a>
      </li>
      <li>
        <Link to="/nfts/0x4e121d145cd52c1537835e6752ddf21bcd58c10a/2">NFT Auctions</Link>
      </li> */}
        <li>
          <NavLink
            style={(isActive) => ({
              color: isActive ? '#98c063' : '',
            })}
            to="/createEvent"
          >
            Create event
          </NavLink>
        </li>
        <li>
          <NavLink
            style={(isActive) => ({
              color: isActive ? '#98c063' : '',
            })}
            to="/manageDrop"
          >
            Manage drop
          </NavLink>
        </li>
        <li>
          <NavLink
            style={(isActive) => ({
              color: isActive ? '#98c063' : '',
            })}
            to="/userNfts"
          >
            Explore Collection
          </NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink
              style={(isActive) => ({
                color: isActive ? '#98c063' : '',
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
    </nav>
  );
};

export default Navigation;
