import cardBoredApeYachtClub from '@assets/images/NftCards/Card-Image/NftCards__Bored_Ape_Yacht_Club.png';
import cardCryptoKitties12345 from '@assets/images/NftCards/Card-Image/NftCards__CryptoKitties_12345.png';
import cardCryptoKitties14781 from '@assets/images/NftCards/Card-Image/NftCards__CryptoKitties_14781.png';
import cardAssetDash from '@assets/images/NftCards/Card-Image/NftCards__AssetDash.png';

import userAvatar from '@assets/images/account/avatars/userAvatar.png';
import userBackground from '@assets/images/account/backgrounds/userBackground.jpg';

import userAddedFavorite1 from '@assets/images/NftCards/LastAddedFavorite/lastAddToFavirite_1.png';
import userAddedFavorite2 from '@assets/images/NftCards/LastAddedFavorite/lastAddToFavirite_2.png';

interface UserInfoTypes {
  firstName?: string;
  lastName?: string;
  userOnline?: boolean;
  login?: string;
  sinceDate?: string;
  description?: string;
  avatarPath?: string;
  backgroundPath?: string;
  userStats?: {
    title?: string;
    count?: number;
  }[];
  userSocials?: {
    title?: string;
    url?: string;
  }[];
  userNftCollection?: {
    name?: string;
    cardUrl?: string;
    imagePath?: string;
    collection?: string;
    checkedStatus?: boolean;
    lastPrice?: number;
    favoriteCard?: boolean;
    favoriteCount?: number;
    favoriteLastAdded?: any;
  }[];
}

export const UserInfo: UserInfoTypes = {
  firstName: 'Jessica',
  lastName: 'Cole',
  userOnline: true,
  login: '@jessica',
  sinceDate: 'Mar 15, 2021',
  description: `A dreaming illustartor who depict certain moments of small stories.
								Acfeeffef dreaming illustartor who depict certain moments of small stories.`,
  avatarPath: `${userAvatar}`,
  backgroundPath: `${userBackground}`,
  userStats: [
    { title: 'Followers', count: 10 },
    { title: 'Following', count: 765 },
    { title: 'Favorites', count: 16 },
  ],
  userSocials: [
    { title: 'Facebook', url: '/1' },
    { title: 'Instagram', url: '/2' },
    { title: 'Twitter', url: '/3' },
  ],
};
