import { useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';

import { Row, Button } from 'antd';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WALLETS } from '@modules/common/const';

import s from './InitializingWallet.module.scss';
import Loader from '@modules/look/Loader';

const InitializingWallet = ({
  connector,
  error = false,
  activateWallet,
  setPendingError,
}: {
  connector: AbstractConnector | undefined;
  error?: boolean;
  activateWallet: (connector: AbstractConnector) => void;
  setPendingError: (error: boolean) => void;
}) => {
  const { isLightMode } = useContext(AppContext);
  return (
    <>
      <Row className={s.initializingWallet} wrap={false} align="middle">
        {error ? (
          <>
            Error Connecting
            <Button
              className="button-3 btn-error small"
              onClick={() => {
                setPendingError(false);
                connector && activateWallet(connector);
              }}
            >
              try again
            </Button>
          </>
        ) : (
          <>
            <Loader isDark={isLightMode} />
            Waiting...
          </>
        )}
      </Row>
      {WALLETS.map(({ name, icon, walletConnector }) => {
        if (walletConnector === connector) {
          return (
            <Row
              className={s.initializingWallet__wallet}
              wrap={false}
              justify="space-between"
              align="middle"
              key={name}
            >
              <div>
                <p>{name}</p>
                <span>Connecting to {name}</span>
              </div>
              <img
                src={require(`../../../../assets/images/wallet-icons/${icon}`).default}
                alt="wallet icon"
              />
            </Row>
          );
        }
        return null;
      })}
    </>
  );
};

export default InitializingWallet;
