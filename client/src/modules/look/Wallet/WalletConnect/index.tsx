import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Button } from 'antd';
import { WALLETS, ACTIVATE_NETWORK } from '@modules/common/const';
import AppContext from '@modules/layout/context/AppContext';
import { network } from '@utils/connectors';
import { delay, formatAddress } from '@utils/index';

import { useMediaQuery } from '@modules/common/hooks';
import ModalContainer from '@modules/look/ModalContainer';
import { WrongNetwork, InitializingWallet } from '@modules/look/Wallet';

// default avatar
import defaultUserAvatarPrimary from '@assets/images/account/avatars/default-avatar--primary.svg';
import defaultUserAvatarDark from '@assets/images/account/avatars/default-avatar--dark.png';

import disconnectIconWhite from '@assets/images/disconect-icon--white.svg';
import disconnectIconDark from '@assets/images/disconect-icon--dark.svg';

import styles from './WalletConnect.module.scss';
import cn from 'classnames';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { InjectedConnector } from '@web3-react/injected-connector';

/**
 * Used for resetting account selection in Metamask
 * @param connector InjectedConnector
 */
async function resetPermissions(connector: InjectedConnector) {
  // Runs only they are brand new, or have hit the disconnect button
  const provider = await connector.getProvider();
  await provider.request({
    method: 'wallet_requestPermissions',
    params: [
      {
        eth_accounts: {},
      },
    ],
  });
}

const WalletConnect = ({ big = false }: { big?: boolean }) => {
  const history = useHistory();
  const [isInitializingVisible, setIsInitializingVisible] = useState(false);
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>();
  const [pendingError, setPendingError] = useState<boolean>();
  const [currentWallet, setCurrentWallet] = useState<{
    name: string;
    icon: string;
    walletConnector: object;
  }>();
  const [isWrongNetworkVisible, setIsWrongNetworkVisible] = useState(false);
  const isMobile = useMediaQuery(1024);

  const { activate, account, connector, deactivate, error } = useWeb3React();
  const { setIsWalletModalVisible, isWalletModalVisible, isLightMode } = useContext(AppContext);

  const getCurrentWallet = (currentConnector: AbstractConnector) => {
    const wallet = WALLETS.find(({ walletConnector }) => currentConnector === walletConnector);
    setCurrentWallet(wallet);
  };

  const activateWallet = useCallback((walletConnector: AbstractConnector) => {
    setPendingWallet(walletConnector);
    setIsWalletModalVisible(false);
    setIsInitializingVisible(true);
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (walletConnector instanceof WalletConnectConnector) {
      // eslint-disable-next-line no-param-reassign
      walletConnector.walletConnectProvider = undefined;
    }

    if (walletConnector && walletConnector instanceof InjectedConnector) {
      resetPermissions(walletConnector);
    }

    if (walletConnector) {
      activate(walletConnector, undefined, true).catch((err) => {
        if (err instanceof UnsupportedChainIdError) {
          activate(walletConnector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
    }
  }, []);

  const handleCloseOnLogin = async () => {
    await delay(2000);
    setIsInitializingVisible(false);
  };

  const handleShowWrongNetwork = async () => {
    await delay(2000);
    setIsWrongNetworkVisible(true);
    activate(network);
  };

  useEffect(() => {
    if (account) {
      handleCloseOnLogin();
    }
  }, [account]);

  useEffect(() => {
    connector && getCurrentWallet(connector);
  }, [connector]);

  useEffect(() => {
    !account &&
      !connector &&
      !currentWallet &&
      activate(ACTIVATE_NETWORK, (err) => console.error(err), true);
  }, [account, connector, currentWallet]);

  useEffect(() => {
    if (error && error instanceof UnsupportedChainIdError) {
      handleShowWrongNetwork();
    }
  }, [error]);

  const [userMenuDropdown, setUserMenuDropdown] = useState(false);

  const showUserMenu = () => {
    setUserMenuDropdown(!userMenuDropdown);
  };

  const userMenuRef = useRef<any>();

  const handlerOutsideClick = (e: any) => {
    if (!e.path.includes(userMenuRef.current)) {
      setUserMenuDropdown(false);
    }
  };

  useEffect(() => {
    if (userMenuDropdown) {
      document.body.addEventListener('click', handlerOutsideClick);
    }
    return () => {
      document.body.removeEventListener('click', handlerOutsideClick);
    };
  }, [userMenuDropdown, handlerOutsideClick]);

  return (
    <>
      <div className={styles.walletInfoWrapp}>
        {account && connector && currentWallet ? (
          <>
            {/* <div
              className={styles.walletInfo__avatar}
              onClick={() => history.push(`/account/${account}`)}
            >
              <img
                src={isLightMode ? defaultUserAvatarPrimary : defaultUserAvatarDark}
                alt="User Avatar"
              />
            </div> */}
            <button className={styles.walletInfo} onClick={showUserMenu}>
              {!isMobile && <p>{formatAddress(account)}</p>}
            </button>
            {userMenuDropdown && (
              <ul className={styles.userMenu} ref={userMenuRef}>
                <li>
                  <button
                    onClick={() => deactivate()}
                    className={cn(styles.userMenu__disconnectBtn)}
                  >
                    <div>
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.91699 8.51154H15.9999"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.6904 6.20386L15.9998 8.51155L13.6904 10.8192"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.9215 13.6923C12.8847 14.7723 11.5482 15.5175 10.084 15.8323C8.61978 16.147 7.09482
                           16.0168 5.70527 15.4585C4.31571 14.9001 3.1251 13.9391 2.28659 12.699C1.44807 11.459
                            1 9.99659 1 8.5C1 7.00341 1.44807 5.54103 2.28659 4.30098C3.1251 3.06093 4.31571
                             2.09992 5.70527 1.54155C7.09482 0.98318 8.61978 0.852993 10.084 1.16773C11.5482
                             1.48247 12.8847 2.22775 13.9215 3.30769"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    Disconnect
                  </button>
                </li>
              </ul>
            )}
          </>
        ) : (
          <button
            className={cn(`btn primary ${big && 'explore'}`, styles.btnConnect)}
            onClick={() => setIsWalletModalVisible(true)}
          >
            {big && 'Explore my collection'}
            <span>Connect a wallet</span>
          </button>
        )}
      </div>

      <ModalContainer
        className="Modal-container padding-reset"
        isVisible={isWalletModalVisible}
        handleCancel={() => setIsWalletModalVisible(false)}
        width={468}
      >
        <div className={cn(styles.modal, 'bg-pattern-2')}>
          <span className={cn(styles.statusIcon, 'status-icon-pattern-2')}></span>
          <h4 className={styles.modal__title}>Select a wallet</h4>
          <ul className={styles.walletList}>
            {WALLETS.map(({ name, icon, walletConnector }) => {
              if (isMobile && name === 'Metamask') return;
              return (
                <li key={name}>
                  <Button onClick={() => activateWallet(walletConnector)} block>
                    <img
                      src={require(`../../../../assets/images/wallet-icons/${icon}`).default}
                      alt="icon"
                    />
                    Connect {name}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </ModalContainer>
      <ModalContainer
        isVisible={isInitializingVisible}
        handleCancel={() => setIsInitializingVisible(false)}
        width={468}
        isClosable={false}
      >
        <InitializingWallet
          connector={pendingWallet}
          error={pendingError}
          activateWallet={activateWallet}
          setPendingError={setPendingError}
        />
      </ModalContainer>
      <ModalContainer
        className="Modal-container padding-reset"
        isVisible={isWrongNetworkVisible}
        handleCancel={() => {
          setIsWrongNetworkVisible(false);
          setIsInitializingVisible(false);
        }}
        width={468}
      >
        <WrongNetwork>
          <button
            className={cn('btn primary', styles.btn__okay)}
            onClick={() => {
              setIsWrongNetworkVisible(false);
              setIsInitializingVisible(false);
            }}
          >
            Okay
          </button>
        </WrongNetwork>
      </ModalContainer>
    </>
  );
};
export default WalletConnect;
