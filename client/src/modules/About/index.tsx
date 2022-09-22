import styles from './About.module.scss';
import { useHistory } from 'react-router';
import { useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { WalletConnect } from '@modules/look/Wallet';
import ctaImg from '@assets/images/home/title-img.png';
import howImg from '@assets/images/home/how-img.png';
import { Button } from 'antd';
import cx from 'classnames';

const aboutData = [
  {
    title: 'Purpose',
    description: [
      {
        text:
          'The Power Ups are created for the Godwoken Community Members, Developers, Event Organisers, and Promoters. PUps are dedicated to building connections and memories among the Godwoken ecosystem and also to mark meaningful contributions in the history of Godwoken development.',
        type: 'blank',
        span: '',
      },
      {
        text:
          'Therefore, having a guideline on the creation, distribution, and acceptance of PUps is equally important. All members should follow and respect these guidelines mentioned below. As we are getting started, we will keep on adding more to this guideline upon receiving worthy feedback from the community.',
        type: 'blank',
        span: '',
      },
    ],
  },
  {
    title: 'The Do’s',
    description: [
      {
        text:
          'The issuer of PUps should understand the value and importance of these Power Ups. As the name suggests, anyone with these Pups will have power/ responsibility towards newcomers in the ecosystem. Therefore, the PUps should be issued in smaller batches and to meaningful contributions only.',
        type: 'dot',
        span: '',
      },
      {
        text:
          'The issuer should verify the contribution like the attendance of the collector at the event.',
        type: 'dot',
        span: '',
      },
      {
        text:
          'The issuer should keep the sustainability and growth of the Godwoken Ecosystem in mind before the distribution of PUps.',
        type: 'dot',
        span: '',
      },
    ],
  },
  {
    title: 'The Don’ts',
    description: [
      {
        text:
          'The Issuer is not allowed to reward PUps for promotional activities like generic social media engagement or simply for joining a community.',
        type: 'dot',
        span: '',
      },
      {
        text:
          'The Issuer shouldn’t have low production quality or shouldn’t be using duplicates of any pre-existing artwork for the drop. All the collector items for PUPs need to be developed with a certain degree of care.',
        type: 'dot',
        span: '',
      },
      {
        text:
          'The Issuer shouldn’t have historical evidence of incapability for being an issuer of the Pups or platform issues and overly ambitious logistics endeavors resulting in poor drop execution.',
        type: 'dot',
        span: '',
      },
      {
        text:
          'The PUps team will automatically reject drops with any of the following characteristics:',
        type: 'dot',
        span: '',
      },
      {
        text:
          '-Drops having copyrighted/pornographic or sexually explicit/ profanity or inflammatory/hateful or discriminatory content.',
        type: 'warning',
        span: '',
      },
      {
        text:
          '-Drops having politically radicalized content, or those encouraging illegal activities, violate guidelines for copy and creative and lack a responsible distribution plan.',
        type: 'warning',
        span: '',
      },
    ],
  },
  {
    title: 'PUps Design Guideline',
    description: [
      {
        text:
          'The Pups design should be uploaded in PNG or GIF format and the file shouldn’t exceed 200KB in size. Please refrain from uploading any explicit content as it will result in a further ban from the PUps community. Also, do not upload any copyrighted or trademarked artwork without permission from the brand or creator.',
        type: 'dot',
        span: '',
      },
      {
        text:
          'The design should be uploaded along with a description written in English along with appropriate grammar. The description should mention valid details about how you will conduct the drop, drop size, when and where the event is happening and how this drop will create value for the receivers.',
        type: 'dot',
        span: '',
      },
    ],
  },
  {
    title: 'The Review Process',
    description: [
      {
        text:
          'After the issuer contacts the PUps official team to drop a PUps, the requests undergo a manual review by the curators. Reviews have several possible outcomes:',
        type: 'blank',
        span: '',
      },
      {
        text:
          ' - In this case, the team will approve the creation and execution of the drop and the issuer will receive an email accordingly. If in case further information is needed for approval or some changes are needed in the existing request then the team will communicate the same.',
        type: 'highlight',
        span: 'Approval',
      },
      {
        text:
          ' - In this case, the team will send a rejection email. It will happen due to any of the common reasons mentioned in the Don’ts section above.',
        type: 'highlight',
        span: 'Rejection',
      },
      {
        text:
          ' - If issuers wish to appeal a rejection, they can reach out to pups@godwoken.com. The most common reason why drop requests will be rejected is mentioned in the Don’ts section above.',
        type: 'highlight',
        span: 'Appeals [Post Rejection]',
      },
    ],
  },
];

const About = () => {
  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.account}>
      <div className="container h100">
        <div className={styles.about__title}>Power Ups Issuer Guideline</div>
        <div className={styles.about__line}></div>
        <div className={styles.about__text}>
          {aboutData.map(({ title, description }) => (
            <div key={title}>
              <div className={styles.about__descTitle}>{title}</div>
              <div className={styles.about__textDescription}>
                {description.map(({ text, type, span }) => (
                  <div key={text}>
                    {type === 'dot' && <span className={styles.about__dot}></span>}
                    {type === 'highlight' && (
                      <span className={styles.about__highlight}>- {span}</span>
                    )}
                    <p
                      className={cx(
                        type === 'warning' && styles.about__warning,
                        styles.about__description,
                      )}
                    >
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
