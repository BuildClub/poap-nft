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

export const LINKS_NFT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS as string;

export const BASE_URL = process.env.REACT_APP_BACKEND_URL;

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
