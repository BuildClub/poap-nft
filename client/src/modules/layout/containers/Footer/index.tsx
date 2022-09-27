import styles from './Footer.module.scss';
import Logo from '@assets/images/logo/new-logo.svg';
import LogoSoc from '@assets/images/logo/logo-link.png';
import LogoDark from '@assets/images/logo/new-logo-dark.svg';
import TwitterImg from '@assets/images/footer/twitter.svg';
import DiscordImg from '@assets/images/footer/discord.svg';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';

const Footer = () => {
  const { isLightMode } = useContext(AppContext);
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footer__row}>
          <div className={styles.footer__block}>
            <div className={styles.footer__logo}>
              <Link to="/">
                <img src={isLightMode ? LogoDark : Logo} alt="" />
              </Link>
            </div>
            <div className={styles.footer__info}>
              Mint Godwoken Power Ups (PUps) NFTs and share them to celebrate events, prizes, wins
              and more. Show off your personal collection of PUps.
            </div>
            <div className={styles.footer__companyInfo}>
              Mint Godwoken Power Ups (PUps) NFTs and share them to celebrate events, prizes, wins
              and more. Show off your personal collection of PUps.
            </div>
          </div>
          <div className={styles.footer__block}>
            <div className={styles.footer__title}>Join Our Community</div>

            <div className={styles.footer__social}>
              <a target="_blank" href="https://twitter.com/GodwokenRises">
                <img src={TwitterImg} alt="" />
              </a>
              <a className="ml-2" target="_blank" href="https://discord.gg/548hTG2Ku2">
                <img src={DiscordImg} alt="" />
              </a>
              <a className={styles.footer__social_logo} target="_blank" href="https://godwoken.com">
                <img src={LogoSoc} alt="" />
              </a>
            </div>
            <div className={styles.footer__rights}>©2022 - PUps | All right reserved</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
