import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';

import { Link } from 'react-router-dom';
import { Select, Skeleton, Tabs } from 'antd';
import { UserInfo } from './components/UserInfo';
import ModalContainer from '@modules/look/ModalContainer';
import WaitingModal from '@modules/look/Wallet/WaitingModal';
import NftImageNotFound from '@modules/common/components/NftImageNotFound';
import { formatAddress } from '@utils/index';
import CheckedIcon from '@assets/images/NftCards/checked-icon.svg';
import { isAddress } from '@ethersproject/address';
import { useNftMetadataWithInfura } from '@modules/common/hooks';
import { useHistory, useParams } from 'react-router';
import { useWeb3React } from '@web3-react/core';

import s from './NftInfo.module.scss';
import { useERC721Contract, usePoapLinksUnsignContract } from '@modules/common/hooks/useContract';
import { buildQuery } from '@utils/contracts';
import { LINKS_NFT_ADDRESS } from '@utils/constants';
import { useQuery } from 'react-query';
import NftImageSource from '@modules/common/components/NftImageSource';
import ErrorModal from '@modules/look/Wallet/ErrorModal';
import { COLLECTION_NAME_KEY } from '@utils/queryKeys';
import AsyncImage from '@modules/common/components/AsyncImage';

const Nft = () => {
  const { address, id } = useParams<{ address: string; id: string }>();
  const history = useHistory();

  const [isModalSalesSettings, setIsModalSalesSettings] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isAddress(address)) {
      history.push('/');
    }
  }, [address]);

  const { ownerOf: ownerOfQuery, name: nameQuery } = useERC721Contract(address);

  const { data: collectionName, refetch: refetchCollectionName } = useQuery(
    `${COLLECTION_NAME_KEY}_${address}_${id}`,
    (): Promise<any> => buildQuery(nameQuery),
    {
      onError: (err) => console.log(err, `${COLLECTION_NAME_KEY}_${address}_${id}`),
    },
  );

  const { uri: tokenUriQuery } = usePoapLinksUnsignContract(LINKS_NFT_ADDRESS, true);

  const { data: tokenUri, isLoading: isTokenUriLoading } = useQuery(
    `tokenUriNftInfo_${address}_${id}`,

    (): Promise<any> => buildQuery(tokenUriQuery, [id]),
    {
      onError: (err) => console.log(err, `tokenUriNftInfo_${address}_${id}`),
    },
  );

  const { imgUri, nftName, nftDiscription, isLoading } = useNftMetadataWithInfura(tokenUri);

  const errorModalCloseBtn = useCallback(() => {
    setIsModalSalesSettings(false);
    setIsErrorModalVisible(false);
  }, []);

  // For Example variable
  const nftAuthor = '';

  const imageErrorHandler = () => {
    console.log('Image error');
  };

  return (
    <>
      {isLoading ? (
        <div className="container">
          <section className="skeleton">
            <Skeleton active />
          </section>
        </div>
      ) : (
        <div className="container">
          <section className={s.nftInfo__card}>
            <aside className={s.nftInfo__cardImage}>
              {imgUri ? (
                <AsyncImage src={imgUri} alt="Image" onError={imageErrorHandler} />
              ) : (
                <div className={s.nftInfo__cardImageNotFound}>
                  <NftImageNotFound />
                </div>
              )}
            </aside>
            <main className={s.nftInfo__info}>
              <header className={s.nftInfo__heading}>
                {collectionName && (
                  <p className={s.nftInfo__collection}>
                    <span className={s.nftInfo__collectionTitle}>Collection:</span>
                    <span className={s.nftInfo__collectionName}>
                      {collectionName && collectionName} #{id.length >= 10 ? formatAddress(id) : id}
                    </span>{' '}
                    {collectionName && (
                      <span className={s.nftInfo__checked}>
                        <img src={CheckedIcon} alt="checked icon" />
                      </span>
                    )}
                  </p>
                )}

                {nftName ? (
                  <>{<h1 className={s.nftInfo__name}>{nftName}</h1>}</>
                ) : (
                  <h2 className={s.nftInfo__cardNotFound}>Card not found, try change networks</h2>
                )}
              </header>

              {/* 
              {nftData && (
                <div className={s.nftInfo__subInfo}>
                  <p className={s.nftInfo__owned}>
                    Owned by:{' '}
                    {isOwner ? (
                      <Link to={`/account/${isOwner ? nftData && nftData.owner_of : account}`}>
                        You
                      </Link>
                    ) : (
                      <Link to={`/account/${nftData && nftData.owner_of}`}>
                        {nftData ? formatAddress(nftData.owner_of) : ''}
                      </Link>
                    )}
                  </p>

                  <div className={s.nftInfo__owned__line}></div>

                </div>
              )} */}

              {nftDiscription && (
                <p className={s.nftInfo__description}>Description: {nftDiscription}</p>
              )}

              {nftAuthor && (
                <div className={s.nftInfo__author}>
                  <p className={s.nftInfo__authorName}>
                    Created by: <a href="#">{nftAuthor}</a>
                  </p>
                  {UserInfo.userSocials && (
                    <ul className={s.nftInfo__socials}>
                      {(UserInfo.userSocials || []).map(
                        (userSocials: { title?: string | undefined; url?: string | undefined }) => (
                          <li className={s.nftInfo__socialsItem} key={userSocials.url}>
                            {userSocials.url && (
                              <Link to={userSocials.url}>
                                <i
                                  className={`icon-${
                                    userSocials.title && userSocials.title.toLowerCase()
                                  }`}
                                />
                              </Link>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              )}

              {/*Hide Stock block*/}

              {/*{nftData && (*/}
              {/*  <p className={s.nftInfo__stock}>*/}
              {/*    <span>1/1</span> in stock*/}
              {/*  </p>*/}
              {/*)}*/}

              {/*Hide BTN Group*/}
            </main>
          </section>

          {/* {isDescrpitionActive && (
            <section
              className={cx(
                isDescOpen && s.nftInfo__nftDescription_active,
                s.nftInfo__nftDescription,
              )}
            >
              <h3>Description</h3>
              {nftDescription(address, id)}
              <div className={s.nftInfo__nftDescription_btn} onClick={openDescriptionBtn}>
                {nftBtnDesc}{' '}
                <img className={cx(isDescOpen && 'revert')} src={ArrowIcon} alt="arrow icon" />
              </div>
              {!isDescOpen && <div className={s.nftInfo__nftDescription_fade}></div>}
            </section>
          )} */}

          {/* <section className={s.nftInfo__tabsGroup}>
            <div className="custom-tabs custom-tabs--account custom-tabs--nft-page">
              <Tabs defaultActiveKey="1">
                <TabPane className={s.tabs} tab="Details" key="1">
                  <ul className={s.nftInfo__details}>
                    {address && (
                      <li>
                        <h4>Contract Address</h4>
                        <p>
                          <Link to={`/nfts/${address}`}>{formatAddress(address)}</Link>
                        </p>
                      </li>
                    )}
                    {nftData && (
                      <>
                        {nftData.token_id.length >= 1 && (
                          <li>
                            <h4>Token ID</h4>
                            <p>
                              {nftData.token_id.length >= 10
                                ? formatAddress(nftData.token_id)
                                : nftData.token_id}
                            </p>
                          </li>
                        )}

                        {nftData.contract_type.length >= 1 && (
                          <li>
                            <h4>Token Standard</h4>
                            <p>{nftData ? nftData.contract_type : null}</p>
                          </li>
                        )}
                      </>
                    )}
                    {chain && (
                      <li>
                        <h4>Blockchain</h4>
                        <p>{chain ? chain : ''}</p>
                      </li>
                    )}
                  </ul>
                </TabPane>
                {nftAttributes && (
                  <TabPane className={s.tabs} tab="Properties" key="2">
                    <ul className={s.nftInfo__properties}>
                      {nftAttributes &&
                        nftAttributes.map((attr: any) => (
                          <li key={attr.trait_type}>
                            <p className={s.nftInfo__propertiesType}>{attr.trait_type}</p>
                            <h4 className={s.nftInfo__propertiesValue}>{attr.value}</h4>
                          </li>
                        ))}
                    </ul>
                  </TabPane>
                )}
              </Tabs>
            </div>
          </section> */}
          <ModalContainer
            className="Modal-container padding-reset"
            isVisible={isModalSalesSettings}
            handleCancel={() => {
              setIsModalSalesSettings(false);
              setIsWaitingModalVisible(false);
              setIsErrorModalVisible(false);
            }}
            width={468}
          >
            {isErrorModalVisible && <ErrorModal errorModalCloseBtn={errorModalCloseBtn} />}

            {isWaitingModalVisible && <WaitingModal setIsModalVisible={setIsModalSalesSettings} />}
          </ModalContainer>
        </div>
      )}
    </>
  );
};

export default Nft;
