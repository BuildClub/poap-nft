import styles from './Home.module.scss';
import { useHistory } from 'react-router';
import { useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { WalletConnect } from '@modules/look/Wallet';
import ctaImg from '@assets/images/home/title-img.png';
import howImg from '@assets/images/home/how-img.png';
import nftImg from '@assets/images/nft-img-example.svg';
import { Button } from 'antd';

const Home = () => {
  const history = useHistory();

  const { account, deactivate } = useWeb3React();

  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ctaHandler = () => {
    // console.log('CTA');
    history.push('/UserNfts');
  };

  return (
    <div className={styles.account}>
      <div className="blur-right"></div>
      <div className="container h100">
        <div className={styles.cta}>
          <div className={styles.cta_about}>
            <div className={styles.cta_title}>Collect Godwoken Power Ups</div>
            <div className={styles.cta_text}>
              Mint Godwoken Power Ups (PUps) NFTs and share them to celebrate events, prizes, wins
              and more. Show off your personal collection of PUps.
            </div>
            <Button className={styles.cta_btn} onClick={ctaHandler}>
              Explore My Collection
            </Button>
          </div>
          <div className={styles.cta_img}>
            <img src={ctaImg} alt="" />
          </div>
        </div>
        <div className={styles.how}>
          <div className={styles.how_title}>How do PUps Work?</div>
          <div className={styles.how_subtitle}>
            PUps are a unique NFT given to participants of events and to commemorate those attending
            and receiving achievements made through Godwoken development. PUps can be collected over
            time and collected by, Godwoken community members, Developers, Event organizers, and
            Promoters. So, start your extraordinary cyber collection to document your memories,
            create bonds, celebrate achievements throughout Godwoken development, and maybe win some
            prizes!
          </div>
          <div className={styles.how_imgs}>
            {[...Array(4).keys()].map((item) => (
              <div key={item} className={styles.nft}>
                <img src={nftImg} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
