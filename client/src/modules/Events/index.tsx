import styles from './Events.module.scss';
import cn from 'classnames';
import { useMediaQuery } from '@modules/common/hooks';
import { useHistory } from 'react-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@utils/constants';
import AppContext from '@modules/layout/context/AppContext';
import NftImageNotFound from '@modules/common/components/NftImageNotFound';
import AsyncImage from '@modules/common/components/AsyncImage';
import { ToastContainer, toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import ModalContainer from '@modules/look/ModalContainer';
import ErrorModal from '@modules/look/Wallet/ErrorModal';
import WaitingModal from '@modules/look/Wallet/WaitingModal';

const Events = () => {
  const [events, setEvents] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalSalesSettings, setIsModalSalesSettings] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);

  const errorModalCloseBtn = useCallback(() => {
    setIsModalSalesSettings(false);
    setIsErrorModalVisible(false);
  }, []);

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
        Authorization: `Bearer ${JSON.parse(localStorage.userdata).token}`,
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

  const imageErrorHandler = () => {
    console.log('Image error');
  };

  const approveEventHandler = async (event: any) => {
    try {
      setApproveLoading(true);
      setIsWaitingModalVisible(true);
      setIsModalSalesSettings(true);
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

      const { data: mailData } = await axios.post(`${BASE_URL}/sendmail`, {
        to: event.email,
        subject: 'Power Ups event',
        html:
          '</br > <br /> You event has been approved. The event’s NFT drop will appear in the “Manage Drop” tab very soon. ',
      });

      getEvents();

      setIsWaitingModalVisible(false);
      setIsModalSalesSettings(false);
      setApproveLoading(false);

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
      //@ts-ignore
      console.log('approve event error', error);
      let errorMsg = '';
      //@ts-ignore
      if (
        error &&
        //@ts-ignore
        error.response &&
        //@ts-ignore
        error.response.data &&
        //@ts-ignore
        error.response.data.error &&
        //@ts-ignore
        error.response.data.error.includes('insufficient balance')
      ) {
        errorMsg = 'Insufficient funds on the admin account';
      }
      setIsWaitingModalVisible(false);
      setIsModalSalesSettings(false);
      setApproveLoading(false);
      setIsErrorModalVisible(true);
      toast.error(errorMsg ? errorMsg : 'Something went wrong', {
        position: 'top-right',
        autoClose: 3000,
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

      const { data: mailData } = await axios.post(`${BASE_URL}/sendmail`, {
        to: event.email,
        subject: 'Power Ups event',
        html: '</br > <br /> Your request to create an event has been declined>',
      });

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

  const returnDate = (date: any): any => {
    let newDate = moment(date).format('DD/MM/YYYY');
    return newDate;
  };

  return (
    <div className={styles.account}>
      <div className="container h100">
        <h4 className={styles.title}>Events</h4>
        <section className={styles.cardCollection}>
          <ul className={styles.nftCards}>
            {events.length > 0
              ? events.map((item: any) => {
                  return (
                    <li key={item._id} className={cn(styles.nftCards__item)}>
                      <div className={styles.main}>
                        <div className={styles.nftCards__image}>
                          <div className={styles.nftCards__imageWrapper}>
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
                        </div>
                        <div className={styles.main__info}>
                          <div className={styles.main__info_title}>
                            <div className={styles.main__info_name}>{item.eventName}</div>
                            <div className={styles.main__info_date}>
                              {returnDate(item.createdAt)}
                            </div>
                          </div>
                          <div className={styles.main__info_description}>
                            {item.eventDescription}
                          </div>
                          <div className={styles.main__info_email}>
                            <span>Email:</span> {item.email}
                          </div>
                        </div>
                      </div>
                      <div className={styles.btns_wrapper}>
                        <button
                          className="btn primary"
                          disabled={approveLoading}
                          onClick={() => approveEventHandler(item)}
                        >
                          Approve event
                        </button>

                        <button
                          className="btn secondary"
                          disabled={approveLoading}
                          onClick={() => rejectEventHandler(item)}
                        >
                          Reject event
                        </button>
                      </div>
                    </li>
                  );
                })
              : 'There are no events for approve'}
          </ul>
        </section>
      </div>
      <ToastContainer theme="colored" />
      <ModalContainer
        className="Modal-container padding-reset"
        isVisible={isModalSalesSettings}
        handleCancel={() => {
          setIsWaitingModalVisible(false);
          setIsErrorModalVisible(false);
        }}
        width={468}
      >
        {isErrorModalVisible && <ErrorModal errorModalCloseBtn={errorModalCloseBtn} />}

        {isWaitingModalVisible && (
          <WaitingModal text="Approving event..." setIsModalVisible={setIsModalSalesSettings} />
        )}
      </ModalContainer>
    </div>
  );
};

export default Events;
