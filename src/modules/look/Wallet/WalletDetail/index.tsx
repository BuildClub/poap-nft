import { Button, Row } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { injected, network } from '@utils/connectors';
import { getScanLink, formatAddress } from '@utils/index';
import { useMediaQuery } from '@modules/common/hooks';
import cn from 'classnames';

import styles from './WalletDetail.module.scss';

const WalletDetail = ({
  currentWallet,
}: {
  currentWallet: { name: string; icon: string; walletConnector: object } | undefined;
}) => {
  const { account, connector, chainId, activate } = useWeb3React();
  const isMobile = useMediaQuery(992);

  return (
    <div className={styles.WalletDetail}>
      <Row className={styles.WalletDetail__info} justify="space-between" align="top" wrap={false}>
        <Row wrap={false} align="middle">
          <img
            className={styles.WalletDetail__info__icon}
            src={require(`../../../../assets/images/wallet-icons/${currentWallet?.icon}`).default}
            alt="icon"
          />
          <div>
            <p>{currentWallet?.name}</p>
            <span>{account && formatAddress(account)}</span>
          </div>
        </Row>
        <Button
          className="button-1"
          onClick={() => {
            connector !== injected && (connector as any).close();
            activate(network);
          }}
        >
          Disconnect
        </Button>
      </Row>
      <Row
        className={cn(styles.WalletDetail__links, 'WalletDetail__links')}
        justify="space-between"
      >
        <a
          href="#"
          onClick={() => {
            account && navigator.clipboard.writeText(account);
          }}
        >
          <i className="icon icon-copy" />
          <span>Copy</span>
        </a>
        <a
          href={getScanLink('address', chainId, account || undefined)}
          rel="noreferrer"
          target="_blank"
        >
          <i className="icon icon-external" />
          <span>View on Bscscan</span>
        </a>
      </Row>
    </div>
  );
};

export default WalletDetail;
