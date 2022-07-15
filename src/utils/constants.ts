export interface Address {
  4: string;
  1: string;
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

export const WIDGET_NFT_LIST: NftList = {
  4: [
    {
      CollectionName: 'Rad NFT',
      Author: 'RAD',
      ChackedStatus: true,
      LogoUrl: `${getLogo('rad')}`,
      CollectionProfileUrl: `/nfts/0xfc687Bd6B512CEa05b089dd91bA9147Ea073A9F2`,
    },
  ],
  1: [
    {
      CollectionName: 'RadKingdom Pandas',
      Author: 'Rad Collectibles',
      ChackedStatus: true,
      LogoUrl: `${getLogo('rad')}`,
      CollectionProfileUrl: `/nfts/0x1343b286f44aac0afec4f079e8efd7ee23276434`,
    },
  ],
};

// export const LINKS_NFT_ADDRESS = '0xF56Fe6d2ABB24b437f600C7619F0750B4A549AE2';
// export const LINKS_NFT_ADDRESS = '0xda82D7Ad3CE0929A40c48916E82bc433e904bFDE'; //new updated contract address address uriStorage rinkeby
// export const LINKS_NFT_ADDRESS = '0x62c4389eeBe0DD723eB1e5f96279Fa4790293210'; //new updated contract address address uriStorage rinkeby add baseUri
// export const LINKS_NFT_ADDRESS = '0xA0F84d20871a6774d301E220156Aaa6FF6eFeB2d'; //new updated contract address address uriStorage rinkeby add baseUri anyone can create event
//************************** */

// export const LINKS_NFT_ADDRESS = '0x73070A6e91B6cf1A07b534bB0360a775B4C1aF69';
// export const LINKS_NFT_ADDRESS = '0xA4b86a26A1C6751D9dc320416F30ff2fcbCdC946';
// export const LINKS_NFT_ADDRESS = '0xc91716CFa2B018F3fF22c7d5A960e894E3786c74'; //new address
// export const LINKS_NFT_ADDRESS = '0x93CF12ffb326fdBD218B59A4bD397Aa2816872d2'; //last address
// export const LINKS_NFT_ADDRESS = '0x54a22a1dD7b065c90e52226B88d8E57263B4a84B'; //updated contract address address
// export const LINKS_NFT_ADDRESS = '0xE2B11581de199330FEAc377752F03E36ac2EAF85'; //new updated contract address address
// export const LINKS_NFT_ADDRESS = '0xA5cEEf41b9dF859194c593B90D4c51A8F5a8a551'; //new updated contract address address uriStorage
// export const LINKS_NFT_ADDRESS = '0x2c130958Af59e61f5d8a404c59494586b65F4957'; //new updated contract address address uriStorage add baseUri
export const LINKS_NFT_ADDRESS = '0xDafeE33922AAF21DF0bE49FA44E4642d067361a0'; //new updated contract address address uriStorage add baseUri anyone can create event

export const BASE_URL = 'http://localhost:5002';

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
