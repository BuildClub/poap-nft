import React, { FC, useCallback, useState } from 'react';
import { formatAddress } from '@utils/index';
import cx from 'classnames';
import CheckedIcon from '@assets/images/NftCards/checked-icon.svg';

import styles from '../NftCardsList/NftCardsList.module.scss';
import { useQuery } from 'react-query';
import { buildQuery } from '@utils/contracts';
import { useERC721Contract } from '@modules/common/hooks/useContract';
import WaitingModal from '@modules/look/Wallet/WaitingModal';
import ModalContainer from '@modules/look/ModalContainer';
import { Skeleton, Tooltip } from 'antd';
import { useNftMetadataWithInfura } from '@modules/common/hooks';
import NftImageNotFound from '@modules/common/components/NftImageNotFound';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@modules/common/hooks';
import NftImageSource from '@modules/common/components/NftImageSource';
import ErrorModal from '@modules/look/Wallet/ErrorModal';
import { INftCard } from '@utils/constants';
import { COLLECTION_NAME_KEY } from '@utils/queryKeys';

const NftCard: FC<{
  userCard: INftCard;
  isTokenImgActive: Boolean;
  isNftAssetsActive: boolean | undefined;
}> = ({ userCard }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const { ownerOf: ownerOfQuery, name: nameQuery } = useERC721Contract(userCard.token_address);

  const { data: collectionName, refetch: refetchCollectionName } = useQuery(
    `${COLLECTION_NAME_KEY}_${userCard.token_address}_${userCard.token_id}`,
    (): Promise<any> => buildQuery(nameQuery),
    {
      onError: (err) =>
        console.log(err, `${COLLECTION_NAME_KEY}_${userCard.token_address}_${userCard.token_id}`),
    },
  );

  const { imgUri, nftName, nftDiscription, isLoading } = useNftMetadataWithInfura(
    userCard.token_uri,
  );

  // Format NFT Card Name
  const isBreakpointMobile = useMediaQuery(1024);

  const formatCardName = (name: string) => {
    const symbolLength = () => {
      return isBreakpointMobile ? 20 : 25;
    };

    if (name) {
      if (name.length > symbolLength()) {
        return <>{name.slice(0, symbolLength()) + '...'}</>;
      } else {
        return name;
      }
    } else {
      return '';
    }
  };

  // Format NFT Collection Name
  const formatCollectionName = (name: string, id: string) => {
    const symbolLength = () => {
      return isBreakpointMobile ? 30 : 45;
    };

    if (name) {
      if (name.length > symbolLength()) {
        const nameWithId = name + <span>#{formatAddress(id)}</span>;
        return <>{nameWithId.slice(0, symbolLength()) + '...'}</>;
      } else {
        return `${name} #${formatAddress(id)}`;
      }
    } else {
      return '';
    }
  };

  const errorModalCloseBtn = useCallback(() => {
    setIsModalVisible(false);
    setIsErrorModalVisible(false);
  }, []);

  return (
    <>
      <li className={cx(styles.nftCards__item)}>
        {isLoading ? (
          <div className="skeleton">
            <NftImageNotFound />
            <br />
            <br />
            <Skeleton active />
          </div>
        ) : (
          <>
            <Link
              to={`/nfts/${userCard.token_address}/${userCard.token_id}`}
              className={cx(!imgUri && styles.nftCards__noImage, styles.nftCards__image)}
            >
              {imgUri ? (
                <NftImageSource source={imgUri} controls={false} autoPlay={true} muted={true} />
              ) : (
                <NftImageNotFound />
              )}
            </Link>
            <div className={styles.nftCards__info}>
              <div className={styles.nftCards__mainInfo}>
                {/*==========================*/}
                {/* Card Collection and Name */}
                {/*==========================*/}

                <Tooltip
                  placement="bottomLeft"
                  trigger={collectionName && collectionName.length >= 15 ? 'hover' : ''}
                  title={
                    collectionName && collectionName + ' ' + '#' + formatAddress(userCard.token_id)
                  }
                  overlayClassName={styles.nftCards__tooltip}
                >
                  <h4 className={styles.nftCards__name}>
                    <Link to={`/nfts/${userCard.token_address}/${userCard.token_id}`}>
                      {collectionName && formatCollectionName(collectionName, userCard.token_id)}
                    </Link>
                  </h4>
                </Tooltip>

                <Tooltip
                  placement="bottomLeft"
                  trigger={nftName && nftName.length >= 25 ? 'hover' : ''}
                  title={nftName}
                  overlayClassName={styles.nftCards__tooltip}
                >
                  <div className={styles.nftCards__collection}>
                    <p className={styles.nftCards__collectionInner}>
                      <span className={styles.about__row}>Event: </span> {formatCardName(nftName)}
                    </p>
                    {nftName ? (
                      <div className={styles.nftCards__checked}>
                        <img src={CheckedIcon} alt="checked icon" />
                      </div>
                    ) : null}
                  </div>
                </Tooltip>

                {/*=======*/}
                {/* About */}
                {/*=======*/}

                {userCard && (
                  <ul className={styles.about}>
                    {userCard.token_address && (
                      <li>
                        <p className={styles.about__row}>
                          Collection: {/* <Link to={`/nfts/${userCard.token_address}`}> */}
                          {formatAddress(userCard.token_address)}
                          {/* </Link> */}
                        </p>
                      </li>
                    )}

                    {userCard.owner_of && (
                      <li>
                        <p className={styles.about__row}>
                          Owned By: {/* <Link to={`/account/${userCard.owner_of}`}> */}
                          {formatAddress(userCard.owner_of)}
                          {/* </Link> */}
                        </p>
                      </li>
                    )}
                    {nftDiscription && (
                      <li>
                        <p className={styles.about__row}>Description: {nftDiscription}</p>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </li>

      {/*==============*/}
      {/* Status Modal */}
      {/*==============*/}

      <ModalContainer
        className="Modal-container padding-reset"
        isVisible={isModalVisible}
        handleCancel={() => {
          setIsModalVisible(false);
          setIsErrorModalVisible(false);
          setIsWaitingModalVisible(false);
        }}
        width={468}
      >
        {!isErrorModalVisible && isWaitingModalVisible && (
          <WaitingModal setIsModalVisible={setIsModalVisible} />
        )}
        {isErrorModalVisible && !isWaitingModalVisible && (
          <ErrorModal errorModalCloseBtn={errorModalCloseBtn} />
        )}
      </ModalContainer>
    </>
  );
};

export default NftCard;
