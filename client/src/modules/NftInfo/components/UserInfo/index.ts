interface UserInfoTypes {
  firstName?: string;
  lastName?: string;
  userOnline?: boolean;
  login?: string;
  sinceDate?: string;
  description?: string;
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
