import { Skeleton } from 'antd';
import NftCardsList from '@modules/account/components/NftCardsList/index';
import styles from './usersNft.module.scss';
import { useERC1155Tokens } from '@modules/common/hooks';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

const CollectionAccount = () => {
  const { address } = useParams<{ address: string }>();
  const [nfts, setNfts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { nfts: allNfts, total: allNftsTotal, isLoading: isAllNftsLoading } = useERC1155Tokens(
    address,
  );

  useEffect(() => {
    if (allNfts) {
      // console.log('allNfts', allNfts);

      setNfts(allNfts);
    }
  }, [allNfts, allNftsTotal]);

  return (
    <div className={styles.account}>
      <div className="container h100">
        <section className={styles.cardCollection}>
          {isAllNftsLoading ? <Skeleton active /> : <NftCardsList userCards={nfts} />}
        </section>
      </div>
    </div>
  );
};

export default CollectionAccount;
