import { Skeleton, Tooltip } from 'antd';
import NftCardsList from '@modules/account/components/NftCardsList/index';
import styles from './Events.module.scss';
import cn from 'classnames';
import CheckedIcon from '@assets/images/NftCards/checked-icon.svg';
import { formatAddress, resolveLink } from '@utils/index';
import { useERC1155Tokens, useMediaQuery } from '@modules/common/hooks';
import { useHistory, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { BASE_URL } from '@utils/constants';
import AppContext from '@modules/layout/context/AppContext';
import NftImageNotFound from '@modules/common/components/NftImageNotFound';
import NftImageSource from '@modules/common/components/NftImageSource';
import AsyncImage from '@modules/common/components/AsyncImage';
import { ToastContainer, toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';

const CollectionAccount = () => {
  const { address } = useParams<{ address: string }>();
  const [events, setEvents] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { authToken, isAdmin } = useContext(AppContext);

  const history = useHistory();

  // Scroll To Top when route on this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      history.push('/');
    }
  }, [isAdmin]);

  const getEvents = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`${BASE_URL}/events`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    let filtredEvents = data.filter((item: any) => !item.eventOwner);

    setEvents(filtredEvents);
    setIsLoading(false);
  };

  useEffect(() => {
    if (authToken) {
      getEvents();
    }
  }, [authToken]);

  const isBreakpointMobile = useMediaQuery(1024);

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

  const imageErrorHandler = () => {
    console.log('Image error');
  };

  const approveEventHandler = async (event: any) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/events/createEvent`,
        {
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          eventUri: event.eventUri,
          email: event.email,
          eventId: event._id,
          ownerAddress: event.ownerAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      console.log('data', data);

      const { data: mailData } = await axios.post(`${BASE_URL}/sendmail`, {
        to: event.email,
        subject: 'Nft-Memo event',
        html:
          '</br > <br /> You event has been approved. The event’s NFT drop will appear in the “Manage Drop” tab very soon. ',
      });

      console.log('mailData', mailData);

      getEvents();

      toast.success('Event approved', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log('approve event error', error);
      toast.error('Event not approved', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const rejectEventHandler = async (event: any) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/events/${event._id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('delete', data);

      const { data: mailData } = await axios.post(`${BASE_URL}/sendmail`, {
        to: event.email,
        subject: 'Nft-Memo event',
        html: '</br > <br /> Your request to create an event has been declined>',
      });
      console.log('mailData', mailData);

      getEvents();

      toast.success('Event rejected', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.success('Something goes wrong', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={styles.account}>
      <div className="container h100">
        <section className={styles.cardCollection}>
          <ul className={styles.nftCards}>
            {events.length > 0
              ? events.map((item: any) => {
                  return (
                    <li key={item._id} className={cn(styles.nftCards__item)}>
                      {isLoading ? (
                        <div className="skeleton">
                          <NftImageNotFound />
                          <br />
                          <br />
                          <Skeleton active />
                        </div>
                      ) : (
                        <>
                          <div className={styles.nftCards__image}>
                            {item.eventImage ? (
                              <AsyncImage
                                src={item.eventImage}
                                alt="Image"
                                onError={imageErrorHandler}
                              />
                            ) : (
                              <NftImageNotFound />
                            )}
                          </div>
                          <div className={styles.nftCards__info}>
                            <div className={styles.nftCards__mainInfo}>
                              {/*==========================*/}
                              {/* Card Collection and Name */}
                              {/*==========================*/}

                              <Tooltip
                                placement="bottomLeft"
                                trigger={
                                  item.eventName && item.eventName.length >= 15 ? 'hover' : ''
                                }
                                title={item.eventName && item.eventName}
                                overlayClassName={styles.nftCards__tooltip}
                              >
                                <h4 className={styles.nftCards__name}>
                                  {item.eventName && formatCollectionName(item.eventName, item._id)}
                                </h4>
                              </Tooltip>

                              <Tooltip
                                placement="bottomLeft"
                                trigger={
                                  item.eventName && item.eventName.length >= 25 ? 'hover' : ''
                                }
                                title={item.eventName}
                                overlayClassName={styles.nftCards__tooltip}
                              >
                                <div className={styles.nftCards__collection}>
                                  <p className={styles.nftCards__collectionInner}>
                                    <span className={styles.about__row}>Description: </span>{' '}
                                    {formatCardName(item.eventDescription)}
                                  </p>
                                </div>
                              </Tooltip>

                              <div className={styles.btns_wrapper}>
                                <button
                                  className="btn primary"
                                  onClick={() => approveEventHandler(item)}
                                >
                                  Approve event
                                </button>

                                <button
                                  className="btn secondary"
                                  onClick={() => rejectEventHandler(item)}
                                >
                                  Reject event
                                </button>
                              </div>

                              {/*=======*/}
                              {/* About */}
                              {/*=======*/}
                            </div>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })
              : 'There are no events for approve'}
          </ul>
        </section>
      </div>
      <ToastContainer theme="colored" />
      {/* <ModalContainer
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
                  </ModalContainer> */}
    </div>
  );
};

export default CollectionAccount;
