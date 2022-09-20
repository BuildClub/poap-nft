import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import AppContext from './context/AppContext';
import { NETWORK, LOCAL_STORAGE } from '@modules/common/const';
import Header from '@modules/layout/containers/Header';
import Footer from '@modules/layout/containers/Footer';
import PageNotFound from '@modules/staticPages/PageNotFound';
import { useWeb3React } from '@web3-react/core';
import { setupNetwork } from '@utils/web3';
import axios from 'axios';
import { BASE_URL } from '@utils/constants';
import { useAuth } from '@modules/common/hooks';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { library } = useWeb3React();

  const { pathname } = useLocation();
  const [isLightMode, setIsLightMode] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE.LIGHT_MODE) || 'false'),
  );

  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [authToken, setAuthToken] = useState<string>(
    localStorage.userdata ? JSON.parse(localStorage.userdata).token : '',
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(
    localStorage.userdata ? JSON.parse(localStorage.userdata).isAdmin : false,
  );

  const handleSwitchLightMode = useCallback((value: boolean) => {
    setIsLightMode(value);
    window.localStorage.setItem(LOCAL_STORAGE.LIGHT_MODE, value.toString());
  }, []);

  const { logout } = useAuth();
  const history = useHistory();

  //************************* */
  // const setDefaultNetwork = () => {
  //   const localStorageNetworkKey = localStorage.getItem('network');
  //   if (!localStorageNetworkKey) {
  //     localStorage.setItem(LOCAL_STORAGE.NETWORK, Object.keys(NETWORK)[0]);
  //   }
  // };
  //************************* */

  const context = {
    isLightMode,
    handleSwitchLightMode,
    isWalletModalVisible,
    setIsWalletModalVisible,
    authToken,
    setAuthToken,
    isAdmin,
    setIsAdmin,
  };

  //************************* */
  // useEffect(() => {
  //   setDefaultNetwork();
  // }, []);
  //************************* */

  const setNetwork = useCallback(async () => {
    // if (library) {
    await setupNetwork();
    // }
  }, [library]);

  useEffect(() => {
    if (library) {
      setNetwork();
    }
  }, [library]);

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${BASE_URL}/users/checkAuth`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } catch (error) {
        //@ts-ignore
        console.log('AUTH ERROR', error.response.status);
        //@ts-ignore
        if (error.response.status === 401) {
          console.log('LOGOUT');
          logout();
          setAuthToken('');
          setIsAdmin(false);
          history.push('/');
        }
      }
    };
    const intervalId = setInterval(() => {
      if (authToken) {
        checkAuth();
      }
    }, 5000); // in milliseconds
    return () => clearInterval(intervalId);
  }, [authToken]);

  return (
    <>
      <div className="wrapper">
        <div className="blur"></div>
        {/* <div className="blur-right"></div> */}
        <AppContext.Provider value={context}>
          {pathname !== '/404' ? (
            <>
              <Header />
              <main className="main">{children}</main>
              <Footer />
            </>
          ) : (
            <PageNotFound />
          )}
        </AppContext.Provider>
      </div>
    </>
  );
};
export default Layout;
