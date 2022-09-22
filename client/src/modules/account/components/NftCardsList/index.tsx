import { FC, useEffect, useState } from 'react';
import NftCard from '../NftCard';

import styles from './NftCardsList.module.scss';
import { INftCard } from '@utils/constants';

const Index: FC<{
  userCards: INftCard[];
  isTokenImgActive?: Boolean;
  isNftAssetsActive?: boolean | undefined;
}> = ({ userCards, isTokenImgActive = false, isNftAssetsActive = false }) => {
  const [nfts, setNfts] = useState<any>([]);

  useEffect(() => {
    if (userCards.length > 0) {
      let nftsByPage = userCards.slice(0, 8);
      setNfts(nftsByPage);
    }
  }, [userCards]);

  return (
    <>
      {userCards.length > 0 ? (
        <ul className={styles.nftCards}>
          {userCards.map((userNftCard: INftCard) => (
            <NftCard
              userCard={userNftCard}
              key={userNftCard.token_id}
              isTokenImgActive={isTokenImgActive}
              isNftAssetsActive={isNftAssetsActive}
            />
          ))}
        </ul>
      ) : (
        <div>You don't have nfts in this collection</div>
      )}
    </>
  );
};

export default Index;
