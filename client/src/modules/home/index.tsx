import styles from './Home.module.scss';
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import ctaImg from '@assets/images/home/title-img.png';
import nftImg from '@assets/images/nft-img-example.svg';
import { Button } from 'antd';

const Home = () => {
  const history = useHistory();

  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ctaHandler = () => {
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
            PUps can be collected over time by Godwoken community members, developers, event
            organizers, promoters, and those who participate in both online and irl events! So start
            your extraordinary cyber collection to document your memories, create bonds, celebrate
            achievements throughout Godwoken development, and maybe win some prizes!
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
