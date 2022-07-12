import styles from './Footer.module.scss';
import AppLogo from '@modules/layout/containers/Header/components/Logo';
import moment from 'moment';

// const Socialslinks = [
//   { url: 'https://www.facebook.com/RadNFTv', title: 'facebook' },
//   { url: 'https://twitter.com/RadNFTv', title: 'twitter' },
//   { url: 'https://discord.gg/CE4qDHH426', title: 'discord' },
//   { url: 'https://www.instagram.com/RadNFTv', title: 'instagram' },
//   { url: 'https://www.linkedin.com/company/radnftv/', title: 'linkedin' },
//   { url: 'https://medium.com/watchrad', title: 'medium' },
// ];

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className={styles.footer__row}>
        <div>
          Powered By Nervos
          {/* <AppLogo /> */}
          {/* <h4 className={styles.footer__title}>The New Creative Economy.</h4> */}
        </div>
        {/* <nav className={styles.footer__nav}>
          <div>
            <h5 className={styles.footer__subTitle}>Company</h5>
            <ul>
              <li>
                <a href="https://littlestar.com" target="_blank">
                  About
                </a>
              </li>
              <li>
                <a href="mailto:content@rad.live">Partnerships</a>
              </li>
              <li>
                <a href="https://angel.co/company/watchrad" target="_blank">
                  Careers
                </a>
              </li>
              <li>
                <a href="mailto:support@rad.live">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className={styles.footer__subTitle}>Helpful links</h5>
            <ul>
              <li>
                <a
                  href="https://littlstar.zendesk.com/hc/en-us/categories/360001797351-FAQ"
                  target="_blank"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a href="https://support.rad.live" target="_blank">
                  Support
                </a>
              </li>
              <li>
                <a href="https://littlestar.com/terms" target="_blank">
                  Terms
                </a>
              </li>
              <li>
                <a href="https://littlestar.com/copyright" target="_blank">
                  Copyright
                </a>
              </li>
              <li>
                <a href="https://littlestar.com/privacy" target="_blank">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </nav> */}
        {/* <div className={styles.socials}>
          <h5 className={styles.footer__subTitle}>Follow us</h5>
          <ul className={styles.socials__list}>
            {Socialslinks.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank">
                  <i className={`icon-${item.title}`} />
                </a>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
      {/* <div className={styles.footer__row}>
        <p className={styles.footer__signature}>Powered By Nervos {moment().year()}</p>
      </div> */}
    </div>
  </footer>
);

export default Footer;
