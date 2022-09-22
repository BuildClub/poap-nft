import React from 'react';
import cn from 'classnames';
import styles from './WrongNetwork.module.scss';

interface IWrongNetwork {
  children?: React.ReactNode;
}

const WrongNetwork = ({ children }: IWrongNetwork) => {
  return (
    <div className={cn(styles.wrong, 'bg-pattern-2')}>
      <span className={cn(styles.statusIcon, 'status-icon-pattern-1')}></span>
      <h5>Wrong Network</h5>
      <p>Please switch wallet to Mainnet Chain to continue using the app.</p>
      <div className={styles.btnGroup}>{children}</div>
    </div>
  );
};

export default WrongNetwork;
