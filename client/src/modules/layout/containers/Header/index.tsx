import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tabs } from 'antd';
import AppContext from '@modules/layout/context/AppContext';
import Logo from '@assets/images/logo/logo.png';
import WalletConnect from '@modules/look/Wallet/WalletConnect';
import Navigation from '@modules/look/Navigation';
import { useAuth, useMediaQuery } from '@modules/common/hooks';
import cx from 'classnames';
import themeModeIcon from '@assets/images/mode.png';
import themeModeIconLight from '@assets/images/mode_light.png';

import styles from './Header.module.scss';
import ModalContainer from '@modules/look/ModalContainer';
import WaitingModal from '@modules/look/Wallet/WaitingModal';
import Input from 'antd/lib/input/Input';
import axios from 'axios';
import { BASE_URL } from '@utils/constants';

const { TabPane } = Tabs;

const Header = () => {
  const isBreakpoint = useMediaQuery(1024);
  const [activeNav, setActiveNav] = useState<boolean>(false);
  const [isAuthorize, setIsAuthorize] = useState<boolean>(false);
  const { handleSwitchLightMode, isLightMode, authToken, setAuthToken, setIsAdmin } = useContext(
    AppContext,
  );

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);
  const [isUnstakeTab, setUnstakeTab] = useState<boolean>(false);

  const [signinForm, updateSigninForm] = useState({ email: '', password: '' });
  const [signinFormReg, updateSigninFormReg] = useState({ email: '', password: '' });

  const { login, logout, token } = useAuth();

  const SwitchLightMode = () => {
    isLightMode ? handleSwitchLightMode(false) : handleSwitchLightMode(true);
  };

  const navIconToggle = () => {
    setActiveNav((prev) => !prev);
  };

  useEffect(() => {
    if (token) {
      setIsAuthorize(true);
    } else {
      setIsAuthorize(false);
    }
  }, [token]);

  const handleAuth = useCallback(() => {
    // setIsWaitingModalVisible(true);
    if (!token) {
      setIsModalVisible(true);
    } else {
      logout();
      setAuthToken('');
      setIsAdmin(false);
    }
  }, [token]);

  const singinBtn = async () => {
    // console.log('signinForm.password || !signinForm.email', signinForm.password, signinForm.email);

    if (!signinForm.password || !signinForm.email) {
      console.log('Sign in error');
      return;
    }

    const { data } = await axios.post(`${BASE_URL}/users/login`, {
      password: signinForm.password,
      email: signinForm.email,
    });
    console.log('data', data);

    login(data.email, data.token, data.userId, data.isAdmin);
    setAuthToken(data.token);
    setIsAdmin(data.isAdmin);
    setIsModalVisible(false);
  };

  const singupBtn = async () => {
    if (!signinFormReg.email || !signinFormReg.password) {
      console.log('input error');
      return;
    }
    const { data } = await axios.post(`${BASE_URL}/users/register`, {
      password: signinFormReg.password,
      email: signinFormReg.email,
    });
    console.log('data', data);

    login(data.email, data.token, data.userId, data.isAdmin);
    setAuthToken(data.token);
    setIsAdmin(data.isAdmin);
    setIsModalVisible(false);
  };

  const checkUnstakeTab = (key: string) => {
    setUnstakeTab(!isUnstakeTab);
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
                <img src={Logo} alt="" />
              </Link>
            </div>
            {!isBreakpoint && <Navigation />}

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

            <>
              <Button onClick={handleAuth} className="btn-primary">
                {isAuthorize ? 'Logout' : 'Login'}
              </Button>
            </>

            {/* <div>{isAuthorize ? 'Logout' : 'Login'}</div> */}
          </div>
        </div>
        <ModalContainer
          className={styles.stakedModal}
          isVisible={isModalVisible}
          handleCancel={() => {
            setIsModalVisible(false);
            setIsWaitingModalVisible(false);
          }}
          width={468}
        >
          {!isWaitingModalVisible && (
            <div className={styles.stakedModal__container}>
              <h4 className={styles.stakedModal__title}>{!isUnstakeTab ? 'Sign in' : 'Sign up'}</h4>
              <Tabs defaultActiveKey="1" onChange={checkUnstakeTab}>
                <TabPane className={styles.stakedModal__tab} tab="Sign in" key="1">
                  <h5 className={styles.subTitle}>Email</h5>
                  <div className={cx(styles.amount)}>
                    <Input
                      className={styles.amountInput}
                      value={signinForm.email}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        updateSigninForm({ ...signinForm, email: e.target.value });
                      }}
                    />
                  </div>

                  <h5 className={styles.subTitle}>Password</h5>

                  <div className={cx(styles.amount)}>
                    <Input
                      className={styles.amountInput}
                      value={signinForm.password}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        console.log('password', e.target.value);
                        updateSigninForm({ ...signinForm, password: e.target.value });
                      }}
                    />
                  </div>

                  <div className={styles.actionBtnWrapp}>
                    <button className="btn primary" onClick={singinBtn}>
                      Login
                    </button>
                  </div>
                </TabPane>
                <TabPane className={styles.stakedModal__tab} tab="Sign up" key="2">
                  <h5 className={styles.subTitle}>Email</h5>
                  <div className={cx(styles.amount)}>
                    <Input
                      className={styles.amountInput}
                      value={signinFormReg.email}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        updateSigninFormReg({ ...signinFormReg, email: e.target.value });
                      }}
                    />
                  </div>

                  <h5 className={styles.subTitle}>Password</h5>

                  <div className={cx(styles.amount)}>
                    <Input
                      className={styles.amountInput}
                      value={signinFormReg.password}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                        console.log('password', e.target.value);
                        updateSigninFormReg({ ...signinFormReg, password: e.target.value });
                      }}
                    />
                  </div>

                  <div className={styles.actionBtnWrapp}>
                    <button className="btn primary" onClick={singupBtn}>
                      Sign Up
                    </button>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          )}
          {isWaitingModalVisible && <WaitingModal setIsModalVisible={setIsModalVisible} />}
        </ModalContainer>
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
