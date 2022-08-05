export interface Address {
  71402: string;
  71401: string;
}

export interface Tokens {
  0: string;
  1: string;
  2: string;
  3: string;
}

export interface Token {
  key: string;
  address: Address;
  decimals: number;
}

export interface Contract {
  address: Address;
}

export interface Contracts {
  [name: string]: Contract;
}
export interface Scheme {
  string: number;
}

const getLogo = (collectionName: string) => {
  return require(`@assets/images/NftCards/Collections-Logo/Collections-Logo__${collectionName}.png`)
    .default;
};

interface WidgetNftListTypes {
  map?: any;
  WidgetNftList?: {
    CollectionName: string;
    Author: number;
    ChackedStatus: boolean;
    LogoUrl: string;
    CollectionProfileUrl: string;
  };
}

export interface NftList {
  map?: any;
  1: WidgetNftListTypes;
  4: WidgetNftListTypes;
}

// export const LINKS_NFT_ADDRESS = '0xdcbd950F8246cD1e2f4Da41CD91219abEB823935'; //testnet
export const LINKS_NFT_ADDRESS = '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB'; //mainnet

export const CONTRACTS: Contracts = {
  Links: {
    address: {
      71402: '0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB',
      71401: '0xdcbd950F8246cD1e2f4Da41CD91219abEB823935',
    },
  },
};

// export const BASE_URL = 'http://localhost:5002';
// export const BASE_URL = 'https://nft-memo-v2.herokuapp.com';
export const BASE_URL = 'http://nft-memo.org';
// export const BASE_URL = 'http://92.205.14.135';

export interface INftCard {
  amount?: string;
  block_number?: string;
  block_number_minted?: string;
  contract_type?: string;
  last_metadata_sync?: any;
  last_token_uri_sync?: any;
  metadata?: string;
  name?: string;
  owner_of: string;
  symbol?: string;
  synced_at?: string;
  token_address: string;
  token_hash?: string;
  token_id: string;
  token_uri: string;
  token_image?: string;
}

export interface INftItem {
  owner_of: string;
  token_address: string;
  token_id: string;
  token_uri: string;
}

export interface IWidget {
  CollectionName: string;
  Author: string;
  ChackedStatus: boolean;
  LogoUrl: string;
  CollectionProfileUrl: string;
}
