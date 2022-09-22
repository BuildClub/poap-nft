import { connectorsByName } from '@utils/connectors';

export const ACTIVATE_NETWORK = connectorsByName.Network;

export const NETWORK: any = {
  eth: 'ETH',
  bsc: 'BSC',
  dot: 'DOT',
};

export const LOCAL_STORAGE = {
  LIGHT_MODE: 'light-mode',
  NETWORK: 'network',
};

export const WALLETS = [
  {
    name: 'Metamask',
    icon: 'metamask.svg',
    walletConnector: connectorsByName.Injected,
  },
  {
    name: 'WalletConnect',
    icon: 'wallet-connect.svg',
    walletConnector: connectorsByName.WalletConnect,
  },
];
