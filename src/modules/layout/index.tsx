import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import AppContext from './context/AppContext';
import { NETWORK, LOCAL_STORAGE } from '@modules/common/const';
import Header from '@modules/layout/containers/Header';
import Footer from '@modules/layout/containers/Footer';
import PageNotFound from '@modules/staticPages/PageNotFound';
import { useWeb3React } from '@web3-react/core';
import { setupNetwork } from '@utils/web3';

const Layout: FC<{ children: ReactNode[] }> = ({ children }) => {
  const { library } = useWeb3React();

  const { pathname } = useLocation();
  const [isLightMode, setIsLightMode] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE.LIGHT_MODE) || 'false'),
  );
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);

  const handleSwitchLightMode = useCallback((value: boolean) => {
    setIsLightMode(value);
    window.localStorage.setItem(LOCAL_STORAGE.LIGHT_MODE, value.toString());
  }, []);

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

  return (
    <>
      <div className="wrapper">
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
