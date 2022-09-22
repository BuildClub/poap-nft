import styles from './Scan.module.scss';
import { useHistory } from 'react-router';
import { useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { WalletConnect } from '@modules/look/Wallet';

const CollectionAccount = () => {
  const history = useHistory();

  const { account, deactivate } = useWeb3React();

  //   const render = useRef(false);

  // useEffect(() => {
  //   deactivate();
  // }, []);

  useEffect(() => {
    account && history.push(`/UserNfts/${account}`);
  }, [account]);

  //   const gertErc721Data = useCallback(async () => {
  //     // const contract = getErc721Contract("0x73070A6e91B6cf1A07b534bB0360a775B4C1aF69");

  //     // console.log("contract", contract);
  //     // console.log('account', account);

  //     if (account) {
  //       try {
  //         const web3 = new Web3('https://godwoken-testnet-v1.ckbapp.dev'); // Your Web3 instance
  //         const contractAddress = '0x73070A6e91B6cf1A07b534bB0360a775B4C1aF69';

  //         const colleteralToken = new web3.eth.Contract(POAP_ABI as any, contractAddress);

  //         console.log('colleteralToken', colleteralToken);

  //         const balance = await colleteralToken.methods.isAdmin(account).call();
  //         console.log('balance', balance);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   }, [account]);

  //   useEffect(() => {
  //     gertErc721Data();
  //   }, [gertErc721Data]);

  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.account}>
      <div className="container h100">
        <section className={styles.cardCollection}>{!account && <WalletConnect big />}</section>
      </div>
    </div>
  );
};

export default CollectionAccount;
