import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import AppContext from '@modules/layout/context/AppContext';
import AppLogo from './components/Logo';
import WalletConnect from '@modules/look/Wallet/WalletConnect';
import Navigation from '@modules/look/Navigation';
import { useMediaQuery } from '@modules/common/hooks';
import cx from 'classnames';
import themeModeIcon from '@assets/images/mode.png';
import themeModeIconLight from '@assets/images/mode_light.png';

import styles from './Header.module.scss';
import { useWeb3React } from '@web3-react/core';

const Header = () => {
  const isBreakpoint = useMediaQuery(1024);
  const [activeNav, setActiveNav] = useState<boolean>(false);
  const { handleSwitchLightMode, isLightMode } = useContext(AppContext);

  const { account, deactivate } = useWeb3React();

  const SwitchLightMode = () => {
    isLightMode ? handleSwitchLightMode(false) : handleSwitchLightMode(true);
  };

  const navIconToggle = () => {
    setActiveNav((prev) => !prev);
  };

  const ToggleThemeMode = () => {
    return (
      <>
        <a className={styles.themeSelector} onClick={SwitchLightMode}>
          <img
            src={isLightMode ? themeModeIconLight : themeModeIcon}
            width="24"
            height="24"
            alt="Thame Mode Icon"
          />
        </a>
      </>
    );
  };

  return (
    <>
      <header className={cx(styles.header, { [styles.header__fixed]: activeNav })}>
        <div className="container">
          <div className={styles.header__row}>
            {isBreakpoint && (
              <>
                <Button
                  className={cx(styles.nav_icon, activeNav && styles.nav_icon_active)}
                  onClick={navIconToggle}
                  role="button"
                  tabIndex={0}
                >
                  <span />
                  <span />
                  <span />
                  <span />
                </Button>
              </>
            )}
            <div className={styles.header__logo}>
              <Link to="/">
                {/* <Link to="/" onClick={deactivate}> */}
                Logo
                {/* <AppLogo /> */}
              </Link>
            </div>
            {!isBreakpoint && <Navigation />}

            {/*<div className={styles.header__search}>*/}
            {/*  <button>*/}
            {/*    <i className="icon-search" />*/}
            {/*  </button>*/}
            {/*  <input type="search" placeholder="Search..." />*/}
            {/*</div>*/}

            {!isBreakpoint && <ToggleThemeMode />}

            <div>
              <WalletConnect />
            </div>

            {isBreakpoint && (
              <>
                <Button
                  onClick={navIconToggle}
                  className={cx(styles.nav_items, activeNav && styles.nav_items_active)}
                >
                  <Navigation themeMode={<ToggleThemeMode />} />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      {isBreakpoint && (
        <>
          <div
            aria-hidden="true"
            className={activeNav ? styles.activeNav : ''}
            onClick={navIconToggle}
          />
        </>
      )}
    </>
  );
};

export default Header;
