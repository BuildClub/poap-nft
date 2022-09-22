import waitingBigEllipse from '@assets/images/waiting-big-ellipse.png';
import waitingSmallEllipse from '@assets/images/waiting-small-ellipse.png';
import { useWeb3React } from '@web3-react/core';
import cn from 'classnames';
import { useMemo } from 'react';
import styles from './WaitingModal.module.scss';

interface IWaiting {
  setIsModalVisible: (prevState: boolean) => void;
  text?: string;
}

const WaitingModal = ({ setIsModalVisible, text = 'Waiting for confirmation' }: IWaiting) => {
  const { chainId } = useWeb3React();

  const chain = useMemo(() => {
    if (chainId === 1) return 'https://etherscan.io/tx/';
    else return 'https://rinkeby.etherscan.io/tx/';
  }, [chainId]);

  return (
    <div className={cn(styles.waiting, 'bg-pattern-1')}>
      <img src={waitingBigEllipse} width="96" height="96" alt="" />
      <img src={waitingSmallEllipse} width="66" height="66" alt="" />
      <h5>{text}</h5>
      {/* <h5>Waiting for confirmation...</h5> */}
      {localStorage.transactionHash && (
        <a
          className={styles.waiting__link}
          href={chain + localStorage.transactionHash}
          target="_blank"
        >
          Transaction link
        </a>
      )}
      <button
        onClick={() => setIsModalVisible(false)}
        className={` ${styles.waiting__btn} btn primary`}
      >
        Close
      </button>
    </div>
  );
};

export default WaitingModal;
