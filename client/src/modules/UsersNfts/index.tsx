import { Skeleton } from 'antd';
import NftCardsList from '@modules/account/components/NftCardsList/index';
import styles from './usersNft.module.scss';
import { useERC1155Tokens } from '@modules/common/hooks';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { WalletConnect } from '@modules/look/Wallet';

const CollectionAccount = () => {
  const { address } = useParams<{ address: string }>();
  const [nfts, setNfts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chainId, account } = useWeb3React();

  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { nfts: allNfts, total: allNftsTotal, isLoading: isAllNftsLoading } = useERC1155Tokens(
    address,
  );

  useEffect(() => {
    if (allNfts) {
      setNfts(allNfts);
    }
  }, [allNfts, allNftsTotal]);

  return !account ? (
    <div className={styles.account}>
      <div className="container h100">
        <h4 className={styles.title}>Explore Collection</h4>
        <section className={styles.cardCollection}>{!account && <WalletConnect big />}</section>
      </div>
    </div>
  ) : (
    <div className={styles.account}>
      <div className="container h100">
        <h4 className={styles.title}>Explore Collection</h4>
        <section className={styles.cardCollection}>
          {isAllNftsLoading ? <Skeleton active /> : <NftCardsList userCards={nfts} />}
        </section>
      </div>
    </div>
  );
};

export default CollectionAccount;
