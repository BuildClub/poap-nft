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
import AsyncImage from '@modules/common/components/AsyncImage';

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

  const imageErrorHandler = () => {
    console.log('Image error');
  };

  return (
    <>
      <li className={styles.main}>
        <div className={styles.nftCards__image}>
          {imgUri ? (
            <div className={styles.nftCards__imageWrapper}>
              {/* {item.eventImage ? (
                            <AsyncImage
                              src={item.eventImage}
                              alt="Image"
                              onError={imageErrorHandler}
                            />
                          ) : (
                            <NftImageNotFound />
                          )} */}

              <AsyncImage src={imgUri} alt="Image" onError={imageErrorHandler} />
            </div>
          ) : (
            <NftImageNotFound />
          )}
        </div>
        <div className={styles.main_name}>{nftName}</div>
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
