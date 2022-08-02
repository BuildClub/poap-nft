import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const POLLING_INTERVAL = 12000;
export const DEFAULT_CHAIN_ID = Number(process.env.REACT_APP_DEFAULT_CHAIN_ID);

export const NETWORK_URLS: { [chainId: number]: string } = {
  // @ts-ignore
  1: process.env.REACT_APP_INFURA_MAINNET,
  // @ts-ignore
  4: process.env.REACT_APP_INFURA_RINKEBY,
  // @ts-ignore
  71401: process.env.REACT_APP_GW_TESTNET_RPC_URL,
  // @ts-ignore
  71402: process.env.REACT_APP_GW_MAINNET_RPC_URL,
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 71401, 71402],
});

export const network = new NetworkConnector({
  urls: {
    1: NETWORK_URLS[1],
    4: NETWORK_URLS[4],
    71401: NETWORK_URLS[71401],
    71402: NETWORK_URLS[71402],
  },
  defaultChainId: DEFAULT_CHAIN_ID,
});

export const walletConnect = new WalletConnectConnector({
  rpc: {
    1: NETWORK_URLS[1],
    4: NETWORK_URLS[4],
    71401: NETWORK_URLS[71401],
    71402: NETWORK_URLS[71402],
  },
  bridge: 'https://pancakeswap.bridge.walletconnect.org/',
  qrcode: true,
  // @ts-ignore
  pollingInterval: POLLING_INTERVAL,
});

export enum ConnectorNames {
  Injected = 'Injected',
  Network = 'Network',
  WalletConnect = 'WalletConnect',
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletConnect,
};
