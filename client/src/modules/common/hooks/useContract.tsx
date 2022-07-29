import { Contract } from '@ethersproject/contracts';

import { getContract, getSignContract, getUnsignContract } from '@utils/contracts';
import ERC20_ABI from '@modules/web3/abi/ERC20.json';
import ERC721_ABI from '@modules/web3/abi/ERC721.json';
import LINKS_NFT_ABI from '@modules/web3/abi/LinksNFT.json';
import { useWeb3React } from '@web3-react/core';
import { Address } from '@utils/constants';
import { getAddressByChainId } from '@utils/index';

function useContractByChainId(address: Address, ABI: any, withSignerIfPossible = true): Contract {
  const { library, account, chainId } = useWeb3React();
  return getContract(
    getAddressByChainId(address, chainId || Number(process.env.REACT_APP_DEFAULT_CHAIN_ID)),
    ABI,
    library,
    withSignerIfPossible && account ? account : undefined,
  );
}

function useContract(address: string, ABI: any, withSignerIfPossible = true): Contract {
  const { library, account } = useWeb3React();
  return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
}

function useSignContract(address: string, ABI: any, withSignerIfPossible = true): Contract {
  const { library, account } = useWeb3React();
  return getSignContract(
    address,
    ABI,
    library,
    withSignerIfPossible && account ? account : undefined,
  );
}

function useUnsignContract(address: string, ABI: any, withSignerIfPossible = true): Contract {
  const { library } = useWeb3React();
  return getUnsignContract(address, ABI, library);
}

export const useTokenContract = (tokenAddress: string, withSignerIfPossible?: boolean): Contract =>
  useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);

export const useERC721Contract = (tokenAddress: string, withSignerIfPossible?: boolean): Contract =>
  useContract(tokenAddress, ERC721_ABI, withSignerIfPossible);

export const usePoapLinksContract = (
  tokenAddress: string,
  withSignerIfPossible?: boolean,
): Contract => useContract(tokenAddress, LINKS_NFT_ABI, withSignerIfPossible);

export const usePoapLinksSignContract = (
  tokenAddress: string,
  withSignerIfPossible?: boolean,
): Contract => useSignContract(tokenAddress, LINKS_NFT_ABI, withSignerIfPossible);

export const usePoapLinksUnsignContract = (
  tokenAddress: string,
  withSignerIfPossible?: boolean,
): Contract => useUnsignContract(tokenAddress, LINKS_NFT_ABI, withSignerIfPossible);

export default useContract;
