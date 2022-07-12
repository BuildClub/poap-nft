import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';

import { injected, network, POLLING_INTERVAL, walletConnect } from './connectors';

import { numberToHex } from 'web3-utils';

export const NetworkContextName = 'INFURA';

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export const getErrorMessage = (error: Error | undefined): string => {
  if (error instanceof NoEthereumProviderError) {
    return (
      'No BSC browser extension ' +
      'detected, install MetaMask on desktop or visit' +
      ' from a dApp browser on mobile.'
    );
  }
  if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  }
  if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your account.';
  }
  console.error(error);
  // @ts-ignore
  return error.message;
};

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

export const setupNetwork = async () => {
  const provider = (window as any).ethereum;
  const chainId = process.env.REACT_APP_DEFAULT_CHAIN_ID;
  if (provider) {
    try {
      await provider.request({
        id: 1,
        jsonrpc: '2.0',
        method: 'wallet_switchEthereumChain',
        //@ts-ignore
        params: [{ chainId: numberToHex(chainId) }],
      });

      return true;
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                //@ts-ignore
                chainId: numberToHex(chainId),
                chainName: 'Godwoken Test Network',
                nativeCurrency: {
                  name: 'CKB',
                  symbol: 'CKB',
                  decimals: 18,
                },
                rpcUrls: ['https://godwoken-testnet-v1.ckbapp.dev'],
                blockExplorerUrls: [`https://gw-explorer.nervosdao.community/`],
              },
            ],
          });
          return true;
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error);
          return false;
        }
      }
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
};
