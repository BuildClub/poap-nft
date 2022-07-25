import { JsonRpcSigner, Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ContractFunction } from '@ethersproject/contracts';
import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber as BigNumberETH } from '@ethersproject/bignumber';

import { calculateGasMargin } from '@utils/index';

export const getSigner = (library: Web3Provider, account: string): JsonRpcSigner =>
  library.getSigner(account).connectUnchecked();

export const getProviderOrSigner = (
  library: Web3Provider,
  account?: string,
): Web3Provider | JsonRpcSigner => (account ? getSigner(library, account) : library);

export const getContract = (
  address: string,
  ABI: any,
  library: Web3Provider | undefined,
  account?: string,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, library && (getProviderOrSigner(library, account) as any));
};

export const getSignContract = (
  address: string,
  ABI: any,
  library: Web3Provider | undefined,
  account?: string,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, library && account && (getSigner(library, account) as any));
};

export const getUnsignContract = (
  address: string,
  ABI: any,
  library: Web3Provider | undefined,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, library);
};

export const buildQuery = async <T>(
  method: ContractFunction,
  args: any[] = [],
  estimateGas?: ContractFunction | null,
  options: any = {},
): Promise<T> => {
  let tx;
  try {
    if (estimateGas) {
      // console.log('estimateGas', method);
      const gasLimit = await estimateGas(...args, options);
      tx = await method(...args, {
        gasLimit: calculateGasMargin(gasLimit as BigNumberETH),
        ...options,
      });
    } else {
      // console.log('else', method);

      tx = await method(...args, options);
    }
    if (tx?.hash) {
      localStorage.transactionHash = `${tx.hash}`;
    }
    if (tx?.wait) {
      await tx.wait();
      console.log('TX', tx);
      localStorage.transactionHash = '';
    }
  } catch (err: any) {
    console.error(`buildQuery failed with args: ${args}`);
    throw new Error(err.error?.message || err.message || err);
  }

  return tx;
};

export const buildQueryGodwoken = async <T>(
  method: ContractFunction,
  args: any[] = [],
  estimateGas?: number,
  options: any = {},
): Promise<T> => {
  let tx;
  try {
    if (estimateGas) {
      tx = await method(...args, {
        gasLimit: estimateGas,
        ...options,
      });
    } else {
      tx = await method(...args, options);
    }
    if (tx?.hash) {
      localStorage.transactionHash = `${tx.hash}`;
    }
    if (tx?.wait) {
      await tx.wait();
      console.log('TX', tx);
      localStorage.transactionHash = '';
    }
  } catch (err: any) {
    console.error(`buildQueryGodwoken failed with args: ${args}`);
    throw new Error(err.error?.message || err.message || err);
  }

  return tx;
};
