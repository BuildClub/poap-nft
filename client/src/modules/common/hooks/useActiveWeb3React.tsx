import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { Web3Provider } from '@ethersproject/providers';

import { NetworkContextName } from '@utils/web3';

export const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const context = useWeb3React<Web3Provider>();
  return context.active || typeof window !== 'undefined'
    ? context
    : useWeb3React<Web3Provider>(NetworkContextName);
};

export default useActiveWeb3React;
