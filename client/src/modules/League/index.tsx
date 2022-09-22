import styles from './League.module.scss';
import { useHistory } from 'react-router';
import { useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { WalletConnect } from '@modules/look/Wallet';
import ctaImg from '@assets/images/home/title-img.png';
import howImg from '@assets/images/home/how-img.png';
import { Button } from 'antd';
import cx from 'classnames';
import friendsImg from '@assets/images/league/friends.svg';
import miranaImg from '@assets/images/league/mirana.png';

const pluses = [
  {
    text: 'Get support for successfully organizing your local meetups.',
  },
  {
    text: 'Represent Godwoken in local meetups, conferences, and gamejams.',
  },
  {
    text: 'Unlock amazing schwag for you and your kickass developer friends.',
  },
  {
    text: 'Be a decision maker and influencer in the Games + Blockchain community.',
  },
  {
    text: 'Become a leader in Games+Blockchain Industry and grow your career.',
  },
  {
    text: 'Access to Godwoken Community Calls for discussing the roadmap',
  },
  {
    text:
      'Connect with top industry leaders, companies, and partners via the Advocates- only Discord server.',
  },
  {
    text:
      'Unlock access to courses, vouchers, and coupons from Godwoken and other prominent partners for enhancing your knowledge.',
  },
];

const resps = [
  {
    title: 'We are looking for members who:',
    desc: [
      'Can contribute a minimum of 3-5 hours per week',
      'Are active in web3/gaming/blockchain space and are mostly working as or aspiring to be a Gaming X Blockchain Developers or Dev Rel.',
      'Have completed at least one web3/blockchain/gaming development tutorial/workshop/course via Build Space/Coursera/Udemy/Edx or any such platform.',
      'Have enough knowledge about blockchain, gaming, and web3 and show it via organizing or participation in events, local meetups, gamejams, hackathons writing or recording tutorials, or speaking at any conference or event.',
    ],
  },
  {
    title: 'The members need to:',
    desc: [
      'Conduct 1 event [meetup/workshop/gamejam/bug hunting/happy hour] per month',
      'Contribute to Godwoken Games+Blockchain Github, Tutorials, Guides, Blogs, YouTube, Community Newsletter, etc.',
      'Support in translating existing content like documents, videos, etc. into local languages.',
    ],
  },
];

const questions = [
  {
    title: 'What Is The Selection Process?',
    text:
      'Please fill out the application form here for demonstrating your community and development contribution. Once we will receive the application, the interviews will happen on a rolling basis to onboard you into the program throughout the year.',
  },
  {
    title: 'How Long Can I Be A League Member?',
    text:
      'For 12 months, you will be a Member (Advocate) and after that, top yearly performers will be appointed to Godwoken Games+Blockchain Council to support upcoming League members, improve the existing program curriculum and guidelines, and also introduce new programs.',
  },
  {
    title: 'Code of Conduct',
    text:
      'Godwoken Developers League is an amazing opportunity for local aspiring community leaders, indie gamers, game and blockchain developers, evangelists, and developer advocates to come together, learn from each other, network, share and most importantly teach the local community and become their voice on an international platform. Our programs have the goal of expanding professional growth for our attendees in web3 X gaming.',
    warn:
      '*Detailed Code of Conduct to be shared in the Devs League Handbook for the onboarded members.',
  },
];

const League = () => {
  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clickHandler = () => {
    console.log('CLICK');
  };

  return (
    <div className={styles.account}>
      <div className="blur-right"></div>
      <div className="blur-down"></div>
      <div className="blur-right-down"></div>
      <div className="container h100">
        <div className={styles.about}>
          <div className={styles.about__title}>GW Devs League</div>
          <div className={styles.about__subtitle}>
            Join one of the world’s first Game+Blockchain Advocacy Programs
          </div>
          <div className={styles.about__titleText}>
            Godwoken League members are voices of local developer communities across the globe who
            will learn, educate and build together to usher in a game development revolution using
            blockchain technology that aligns incentives the right way for both developers and
            gamers.
          </div>
          <button className="btn primary" onClick={clickHandler}>
            Apply to be a League Member Today
          </button>
        </div>

        <div className={styles.title}>Why Should I Join The Program?</div>
        <div className={styles.pluses}>
          {pluses.map(({ text }) => (
            <div key={text} className={styles.pluses__card}>
              <img className={styles.pluses__card_img} src={friendsImg} alt="" />
              <div className={styles.pluses__card_text}>{text}</div>
            </div>
          ))}
        </div>

        <div className={styles.responsibilities}>
          <div className={styles.responsibilities__text}>
            <div className={styles.title}>What Will My Responsibilities Be?</div>
            {resps.map(({ title, desc }) => (
              <>
                <div className={styles.responsibilities__text_title}>{title}</div>
                {desc.map((text) => (
                  <div key={text} className={styles.responsibilities__text_description}>
                    <span></span>
                    <p>{text}</p>
                  </div>
                ))}
              </>
            ))}
          </div>
          <div className={styles.responsibilities__img}>
            <img src={miranaImg} alt="" />
          </div>
        </div>

        <div className={styles.qtn}>
          {questions.map(({ title, text, warn }) => (
            <div key={title}>
              <div className={cx(styles.title, styles.qtnTitle)}>{title}</div>
              <p>{text}</p>
              {warn && <p className={styles.qtn__warn}>{warn}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default League;
