import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tabs } from 'antd';
import AppContext from '@modules/layout/context/AppContext';
import Logo from '@assets/images/logo/new-logo.svg';
import LogoDark from '@assets/images/logo/new-logo-dark.svg';
import WalletConnect from '@modules/look/Wallet/WalletConnect';
import Navigation from '@modules/look/Navigation';
import { useAuth, useMediaQuery } from '@modules/common/hooks';
import cx from 'classnames';
import themeModeIcon from '@assets/images/mode.png';
import themeModeIconLight from '@assets/images/mode_light.png';

import lightIcon from '@assets/images/switchTheme/light.png';
import darkIcon from '@assets/images/switchTheme/dark.png';

import styles from './Header.module.scss';
import ModalContainer from '@modules/look/ModalContainer';
import WaitingModal from '@modules/look/Wallet/WaitingModal';
import Input from 'antd/lib/input/Input';
import axios from 'axios';
import { BASE_URL } from '@utils/constants';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router';

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

  const { login, logout, token } = useAuth();
  const history = useHistory();

  const SwitchLightMode = () => {
    isLightMode ? handleSwitchLightMode(false) : handleSwitchLightMode(true);
  };

  const navIconToggle = () => {
    setActiveNav((prev) => !prev);
  };

  useEffect(() => {
    if (authToken) {
      setIsAuthorize(true);
    } else {
      setIsAuthorize(false);
    }
  }, [authToken]);

  const handleAuth = useCallback(() => {
    // setIsWaitingModalVisible(true);
    if (!token) {
      setIsModalVisible(true);
    } else {
      logout();
      history.push('/');
      setAuthToken('');
      setIsAdmin(false);
    }
  }, [token]);

  const checkUnstakeTab = (key: string) => {
    setUnstakeTab(!isUnstakeTab);
  };

  const ToggleThemeMode = () => {
    return (
      <>
        <input
          defaultChecked={isLightMode}
          className={styles.switchInput}
          type="checkbox"
          id="switch"
        />
        <label className={styles.switchLabel} onClick={SwitchLightMode} htmlFor="switch">
          <img
            className={cx(isLightMode ? styles.switchImgLight : styles.switchImgDark)}
            src={isLightMode ? lightIcon : darkIcon}
            width={isLightMode ? '16' : '12'}
            height={isLightMode ? '16' : '12'}
            alt="Thame Mode Icon"
          />
        </label>
      </>
    );
  };

  const {
    handleChange: signInHandleChange,
    handleSubmit: signInBtn,
    touched: signInTouched,
    resetForm,
    errors: signInError,
    values: signInValues,
  } = useFormik({
    initialValues: {
      signInPassword: '',
      signInEmail: '',
    },
    validationSchema: Yup.object({
      signInPassword: Yup.string().label('Password').required(),
      signInEmail: Yup.string().label('Email').email().required(),
    }),
    onSubmit: async () => {
      try {
        const { data } = await axios.post(`${BASE_URL}/users/login`, {
          password: signInValues.signInPassword,
          email: signInValues.signInEmail,
        });
        // console.log('data', data);

        login(data.email, data.token, data.userId, data.isAdmin);
        setAuthToken(data.token);
        setIsAdmin(data.isAdmin);
        resetForm();
        setIsModalVisible(false);
      } catch (error) {
        console.log('Login error', error);
        //@ts-ignore
        if (error.response && error.response.data && error.response.data.message) {
          //@ts-ignore
          toast.error(error.response.data.message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    },
  });

  const {
    handleChange: signUpHandleChange,
    handleSubmit: signUpBtn,
    touched: signUpTouched,
    resetForm: resetSignUpForm,
    errors: signUpError,
    values: signUpValues,
  } = useFormik({
    initialValues: {
      signUpPassword: '',
      signUpEmail: '',
    },
    validationSchema: Yup.object({
      signUpPassword: Yup.string().label('Password').required(),
      signUpEmail: Yup.string().label('Email').email().required(),
    }),
    onSubmit: async () => {
      try {
        const { data } = await axios.post(`${BASE_URL}/users/register`, {
          password: signUpValues.signUpPassword,
          email: signUpValues.signUpEmail,
        });
        // console.log('data', data);

        login(data.email, data.token, data.userId, data.isAdmin);
        setAuthToken(data.token);
        setIsAdmin(data.isAdmin);
        resetSignUpForm();
        setIsModalVisible(false);
      } catch (error) {
        console.log('Registration error', error);
        //@ts-ignore
        if (error.response && error.response.data && error.response.data.message) {
          //@ts-ignore
          toast.error(error.response.data.message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    },
  });

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
                <img src={isLightMode ? LogoDark : Logo} alt="" />
              </Link>
            </div>
            {!isBreakpoint && <Navigation />}

            {!isBreakpoint && <ToggleThemeMode />}

            {!isBreakpoint && (
              <div>
                <WalletConnect isWalletBtn />
              </div>
            )}

            {isBreakpoint && (
              <>
                <div
                  // onClick={navIconToggle}
                  className={cx(styles.nav_items, activeNav && styles.nav_items_active)}
                >
                  <Navigation
                    themeMode={<ToggleThemeMode />}
                    walletConnect={<WalletConnect close={navIconToggle} isWalletBtn />}
                    close={navIconToggle}
                  />
                </div>
              </>
            )}

            <>
              <Button onClick={handleAuth} className={styles.loginBtn}>
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
                  <form onSubmit={signInBtn}>
                    <h5 className={styles.subTitle}>Email</h5>
                    <div className={cx(styles.amount)}>
                      <Input
                        className={styles.amountInput}
                        onChange={signInHandleChange}
                        value={signInValues.signInEmail}
                        name="signInEmail"
                        id="signInEmail"
                      />
                    </div>
                    {signInError.signInEmail && signInTouched.signInEmail && (
                      <span className={styles.error}>{signInError.signInEmail}</span>
                    )}

                    <h5 className={styles.subTitle}>Password</h5>

                    <div className={cx(styles.amount)}>
                      <Input
                        className={styles.amountInput}
                        onChange={signInHandleChange}
                        value={signInValues.signInPassword}
                        type="password"
                        name="signInPassword"
                        id="signInPassword"
                      />
                    </div>
                    {signInError.signInPassword && signInTouched.signInPassword && (
                      <span className={styles.error}>{signInError.signInPassword}</span>
                    )}

                    <div className={styles.actionBtnWrapp}>
                      <button className="btn primary" type="submit">
                        Login
                      </button>
                    </div>
                  </form>
                </TabPane>
                <TabPane className={styles.stakedModal__tab} tab="Sign up" key="2">
                  <form onSubmit={signUpBtn}>
                    <h5 className={styles.subTitle}>Email</h5>
                    <div className={cx(styles.amount)}>
                      <Input
                        className={styles.amountInput}
                        onChange={signUpHandleChange}
                        value={signUpValues.signUpEmail}
                        name="signUpEmail"
                        id="signUpEmail"
                      />
                    </div>
                    {signUpError.signUpEmail && signUpTouched.signUpEmail && (
                      <span className={styles.error}>{signUpError.signUpEmail}</span>
                    )}

                    <h5 className={styles.subTitle}>Password</h5>

                    <div className={cx(styles.amount)}>
                      <Input
                        className={styles.amountInput}
                        onChange={signUpHandleChange}
                        value={signUpValues.signUpPassword}
                        type="password"
                        name="signUpPassword"
                        id="signUpPassword"
                      />
                    </div>
                    {signUpError.signUpPassword && signUpTouched.signUpPassword && (
                      <span className={styles.error}>{signUpError.signUpPassword}</span>
                    )}

                    <div className={styles.actionBtnWrapp}>
                      <button className="btn primary" type="submit">
                        Sign Up
                      </button>
                    </div>
                  </form>
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
      <ToastContainer theme="colored" />
    </>
  );
};

export default Header;
