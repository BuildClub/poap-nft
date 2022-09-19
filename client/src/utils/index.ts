import BigNumber from 'bignumber.js';
import { BigNumber as BigNumberETH } from '@ethersproject/bignumber';
import { Address } from '@utils/constants';
import { DEFAULT_CHAIN_ID } from '@utils/connectors';
import Numeral from 'numeral';
import { parseUnits, formatUnits } from '@ethersproject/units';
import { useMediaQuery } from '@modules/common/hooks';
import React from 'react';

export const DEFAULT_DECIMAL: number = 18;

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatAddress = (address: string) => {
  return address.length >= 10 ? `${address.slice(0, 5)}...${address.slice(-4)}` : address;
};

export const formatFileName = (name: string) => {
  return name.length >= 30 ? `${name.slice(0, 29)}...${name.slice(-4)}` : name;
};

export const formatNftId = (address: string) => `${address.slice(0, 5)}...`;

export const toK = (num: number) => Numeral(num).format('0.[000000]a').toUpperCase();

export const formatTokensBalanceToK = (balance: number, decimal: number = 6) => {
  const balanceValue = Math.trunc(balance * 10 ** decimal) / 10 ** decimal;
  if (balanceValue < 0.000001) {
    return 0;
  }
  return toK(Number(balanceValue));
};

const UsdFormat = {
  style: 'currency',
  currency: 'USD',
};

const TokenFormat = {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
};

const PercentFormat = {
  style: 'percent',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

export function getExponentValue(decimals: number): BigNumber {
  return new BigNumber(10).pow(decimals);
}

export function getHumanValue(value: string, decimals: number = DEFAULT_DECIMAL): BigNumber {
  return new BigNumber(value).div(getExponentValue(decimals));
}

export function getNonHumanValue(value: string, decimals: number): string {
  return parseUnits(value, decimals).toString();
}

// add 25%
export const calculateGasMargin = (value: BigNumberETH): BigNumberETH =>
  value.mul(BigNumberETH.from(10000).add(BigNumberETH.from(2500))).div(BigNumberETH.from(10000));

export const formatTokensBalance = (balance: number, decimal: number = 6, symbol: string = '') => {
  const balanceValue = Math.trunc(balance * 10 ** decimal) / 10 ** decimal;
  const TokenFormater = new Intl.NumberFormat('en-US', Object.assign({}, TokenFormat));

  return `${TokenFormater.format(balanceValue)} ${symbol}`;
};

export const formatDollarsBalance = (balance: number) => {
  const fractions = balance >= 1.0 ? 0 : 4;
  const UsdFormatter = new Intl.NumberFormat(
    'en-US',
    Object.assign(
      { maximumFractionDigits: fractions, minimumFractionDigits: fractions },
      UsdFormat,
    ),
  );

  return UsdFormatter.format(balance);
};

export const formatPercent = (percent: number) => {
  const PercentFormatter = new Intl.NumberFormat('en-US', PercentFormat);

  return PercentFormatter.format(percent / 10 ** PercentFormat.maximumFractionDigits);
};

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
}

const SCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: 'https://etherscan.io',
  4: 'https://rinkeby.etherscan.io',
};

export function getScanLink(
  type: 'transaction' | 'token' | 'address' | 'block',
  chainId?: ChainId,
  data?: string,
): string {
  const prefix = SCAN_PREFIXES[chainId!] || SCAN_PREFIXES[1];
  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'block': {
      return `${prefix}/block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number, digits: number) => {
  const formatter = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return formatter.format(num);
};

export const formattedNum = (number: any, usd = false) => {
  if (Number.isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : Number(0).toFixed(5);
  }
  const num = parseFloat(number);

  if (num > 500000000) {
    // @ts-ignore
    return (usd ? '$' : '') + toK(num.toFixed(0));
  }

  if (num === 0) {
    if (usd) {
      return '$0.00';
    }
    return Number(0).toFixed(5);
  }

  if (num < 0.00001 && num > 0) {
    return usd ? '< $0.00001' : '< 0.00001';
  }

  if (num > 100000) {
    return usd ? formatDollarAmount(num, 0) : parseFloat(String(num)).toFixed(0).toLocaleString();
  }

  if (usd) {
    if (num < 0.1) {
      return formatDollarAmount(num, 4);
    }
    return formatDollarAmount(num, 2);
  }

  return parseFloat(String(num)).toFixed(5).toString();
};

export const getAddressByChainId = (address: Address, chainId: number | undefined) =>
  chainId && address[chainId as keyof Address]
    ? address[chainId as keyof Address]
    : // @ts-ignore
      address[DEFAULT_CHAIN_ID];

// export function uriToHttp(uri: string): string[] {
//   const protocol = uri.split(':')[0].toLowerCase();
//   switch (protocol) {
//     case 'data':
//       return [uri];
//     case 'https':
//       return [uri];
//     case 'http':
//       return ['https' + uri.substr(4), uri];
//     case 'ipfs':
//       const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
//       return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`];
//     case 'ipns':
//       const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
//       return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`];
//     case 'ar':
//       const tx = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
//       return [`https://arweave.net/${tx}`];
//     default:
//       return [];
//   }
// }

export const resolveLink = (url: string) => {
  if (!url || !url.includes('https://ipfs.infura.io/ipfs/')) return url;
  return url.replace('https://ipfs.infura.io/ipfs/', `https://nft-memo.infura-ipfs.io/ipfs/`);
  // return url.replace('https://ipfs.infura.io/ipfs/', `${process.env.REACT_APP_IPFS_NODE_URL}/`);
};

export const ipfsLinkError = (uri: string | undefined) => {
  if (!uri || !uri.includes('ipfs/')) return uri;
  let CONTENT_ID = uri.slice(uri.indexOf('ipfs/') + 5);
  return `${process.env.REACT_APP_IPFS_NODE_URL}/ipfs/${CONTENT_ID}`;
};

export const onlyNumbersAllowed = (value: string) =>
  value
    .replace(/[^\d.]*/g, '')
    .replace(/([,.])[,.]+/g, '$1')
    .replace(/^[^\d]*(\d+([.,]\d{0,50})?).*$/g, '$1');

export const isVideo = (url: string | undefined) => {
  if (
    (url && url.lastIndexOf('.mp4') !== -1) ||
    (url && url.lastIndexOf('.webm') !== -1) ||
    (url && url.lastIndexOf('.ogg') !== -1)
  )
    return true;
};

export const isImage = (url: string) => {
  if (
    url.lastIndexOf('.jpg') !== -1 ||
    url.lastIndexOf('.tiff') !== -1 ||
    url.lastIndexOf('.png') !== -1 ||
    url.lastIndexOf('.gif') !== -1 ||
    url.lastIndexOf('.bmp') !== -1
  )
    return true;
};

export const nftCollectionInitials = (name: any) => {
  let isNameHasMultipleWords = name.split(' ');

  let isNameHasDash = name.split(/[^A-Za-z\s\\]/);

  let isWordHasUppercaseLetter = false;

  for (let i = 0; i < name.replace(/^./, ' ').length; i++) {
    if (name.replace(/^./, ' ')[i].match(/[A-Z]/)) {
      isWordHasUppercaseLetter = true;
      break;
    }
  }

  if (isNameHasMultipleWords.length > 1) {
    let initials =
      isNameHasMultipleWords[0].slice(0, 1).toUpperCase() +
      isNameHasMultipleWords[1].slice(0, 1).toUpperCase();
    return initials;
  } else if (
    isNameHasMultipleWords.length === 1 &&
    isNameHasDash.length === 1 &&
    isWordHasUppercaseLetter
  ) {
    let firstLetter = name.slice(0, 1);
    const reg = new RegExp(/[A-Z]/, 'gu');
    let secondLetter = name.replace(/^./, ' ').match(reg);
    return firstLetter.toUpperCase() + secondLetter[0];
  } else if (isNameHasDash.length > 1) {
    let firstLetter = name.slice(0, 1).toUpperCase();
    let secondLetter = isNameHasDash[1].slice(0, 1).toUpperCase();
    return firstLetter + secondLetter;
  } else {
    return name.slice(0, 2).toUpperCase();
  }
};

export const addEllipsis = (value: string, length: number, breakpoint: boolean) => {
  return !breakpoint && value.length > length ? `${value?.slice(0, length)}...` : value;
};
