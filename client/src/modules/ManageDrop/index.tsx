import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Select, Skeleton } from 'antd';
import cn from 'classnames';
import s from './ManageDrop.module.scss';
import { LINKS_NFT_ADDRESS, BASE_URL } from '@utils/constants';
import { usePoapLinksSignContract } from '@modules/common/hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { buildQuery } from '@utils/contracts';
import { useMutation, useQuery } from 'react-query';
import {
  EVENTS_LIST_KEY,
  GET_IS_EVENT_NFTS_MINTERD_KEY,
  SET_EVENT_MINTERS_KEY,
} from '@utils/queryKeys';
import * as XLSX from 'xlsx';
import axios from 'axios';
import ModalContainer from '@modules/look/ModalContainer';
import ErrorModal from '@modules/look/Wallet/ErrorModal';
import WaitingModal from '@modules/look/Wallet/WaitingModal';
import refreshIcon from '@assets/images/refresh-light.svg';
import refreshIconDark from '@assets/images/refresh.svg';
import AppContext from '@modules/layout/context/AppContext';
import { ToastContainer, toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

const ManageDrop = ({}) => {
  const { account } = useWeb3React();
  const { isLightMode } = useContext(AppContext);

  const [fileName, setFileName] = useState<string>('');
  const [eventId, setEventId] = useState<number | null>(null);
  const [eventsActive, setEventsActive] = useState<boolean>(false);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [isEventOwner, setIsEventOwner] = useState<boolean>(false);
  const [fileError, setFileError] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);
  const [emails, selEmails] = useState<string[]>([]);
  const [notMintedEvents, setNotMintedEvents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isModalSalesSettings, setIsModalSalesSettings] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);

  const {
    allEvents: allEventsQuery,
    addUserToEvent: setEventMintersQuery,
    getIsEventNftsMinted: getIsEventNftsMintedQuery,
    estimateGas: {
      addUserToEvent: addUserToEventEstimate,
      getIsEventNftsMinted: getIsEventNftsMintedEstimate,
      allEvents: allEventsEstimate,
    },
  } = usePoapLinksSignContract(LINKS_NFT_ADDRESS, true);

  const { data: eventsList, isLoading: isEventsListLoading, refetch: refetchEventsList } = useQuery(
    EVENTS_LIST_KEY,
    (): Promise<any> => buildQuery(allEventsQuery, [], allEventsEstimate),
    {
      onError: (err) => console.log(err, EVENTS_LIST_KEY),
    },
  );

  const errorModalCloseBtn = useCallback(() => {
    setIsModalSalesSettings(false);
    setIsErrorModalVisible(false);
  }, []);

  const { mutateAsync: setEventMinters, isLoading: isSetEventMintersLoading } = useMutation(
    `${SET_EVENT_MINTERS_KEY}_${eventId}`,
    (): Promise<any> =>
      //@ts-ignore
      buildQuery(setEventMintersQuery, [users, +eventId], addUserToEventEstimate),
    {
      onError: (err) => console.log(err, `${SET_EVENT_MINTERS_KEY}_${eventId}`),
    },
  );

  const { mutateAsync: getIsEventNftsMinted } = useMutation(
    `${GET_IS_EVENT_NFTS_MINTERD_KEY}_${eventId}`,
    (currentEvent: number): Promise<any> =>
      //@ts-ignore
      buildQuery(getIsEventNftsMintedQuery, [currentEvent], getIsEventNftsMintedEstimate),
    {
      onError: (err) => console.log(err, `${GET_IS_EVENT_NFTS_MINTERD_KEY}_${eventId}`),
    },
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (eventsList && eventsList.length > 0 && account) {
        let filtredEvents = eventsList.filter(
          (item: any) =>
            item[2].toString() !== '0' && item[4].toLowerCase() === account.toLowerCase(),
        );
        if (filtredEvents > 0) {
          clearInterval(interval);
          return;
        }
      }
      refetchEventsList();
    }, 5000);

    return () => clearInterval(interval);
  }, [eventsList, account]);

  const handleRefresh = async () => {
    await refetchEventsList();
    toast.success('Events are updated', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (eventsList && eventsList.length > 1) {
      const getNotMintedEvents = async (arr: any) => {
        const notMintedArr = [];
        for (const event of arr) {
          const isMinted = await getIsEventNftsMinted(+event[2].toString());
          if (!isMinted) notMintedArr.push(event[2].toString());
        }
        return notMintedArr;
      };

      getNotMintedEvents(eventsList)
        .then((res) => setNotMintedEvents(res))
        .catch((err) => console.log(err));
    }
  }, [eventsList]);

  useEffect(() => {
    setEventsLoading(true);
    if (eventsList && eventsList.length > 1 && account && notMintedEvents.length) {
      let filtredEvents = eventsList.filter(
        (item: any) =>
          notMintedEvents.includes(item[2].toString()) &&
          item[2].toString() !== '0' &&
          item[4].toLowerCase() === account.toLowerCase(),
      );

      if (filtredEvents.length === 0) {
        setEventsActive(false);
        setEventsLoading(false);
        return;
      }

      setEvents(filtredEvents);

      let isEventOwnerExist = filtredEvents.find(
        //@ts-ignore
        (item: any) => item[4].toLowerCase() === account.toLowerCase(),
      );

      if (isEventOwnerExist) {
        setIsEventOwner(true);
      } else {
        setIsEventOwner(false);
      }

      setEventsActive(true);
    } else {
      setEventsActive(false);
      setEventsLoading(false);
    }
  }, [eventsList, account, notMintedEvents]);

  const isSaveBtnActive = useMemo(() => {
    if (!account || !isEventOwner || users.length === 0) return true;
    return false;
  }, [account, isEventOwner, users]);

  const makeDrop = async () => {
    if (users.length === 0 || !isEventOwner) return;

    try {
      setIsWaitingModalVisible(true);
      setIsModalSalesSettings(true);
      const tx = await setEventMinters();

      const receipt = await tx.wait();

      const { data } = await axios.post(`${BASE_URL}/sendmail`, {
        to: emails,
        subject: 'You have received the memo nft',
        html:
          '</br > <br /> Here is the link of the memo nft : <a href="https://collectpups.com">Look at your nft</a><br /><br /> Best Regards.',
      });
      setIsWaitingModalVisible(false);
      setIsModalSalesSettings(false);
    } catch (error) {
      setIsWaitingModalVisible(false);
      setIsModalSalesSettings(true);
      setIsErrorModalVisible(true);
      console.log('Error setEventMinters:', error);
    }
  };

  const setEvent = (e: number) => {
    setEventId(e);
  };

  useEffect(() => {
    if (events.length && !eventId) {
      setEventId(+events[0][2].toString());
    }
  }, [events, eventId]);

  const onChange = (e: any) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    if (!file.name.includes('.xlsx')) {
      setFileError(true);
      return;
    }

    setFileName(file.name);

    setFileError(false);

    reader.onload = (evt) => {
      //@ts-ignore
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      //@ts-ignore
      const dataJson = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const usersEmails = dataJson
        .map((item) => {
          //@ts-ignore
          if (item.length) return item[0];
        })
        .filter((item) => !!item);

      const usersAddresses = dataJson
        .map((item) => {
          //@ts-ignore
          if (item.length) return item[1];
        })
        .filter((item) => !!item);

      selEmails(usersEmails);
      setUsers(usersAddresses);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="container h100">
      <div className={s.inner}>
        <h4 className={s.title}>Manage drop</h4>

        {eventsActive ? (
          <>
            <div className={s.inputs}>
              <div className={cn(s.input, s.refresh)}>
                <fieldset className={cn(s.fakeBorder)}>
                  <legend className={s.fakeBorder__text}>Select event </legend>
                  <div className={'custom-select events'}>
                    <Select
                      defaultValue={events[0][0].toString()}
                      onChange={(value) => setEvent(value)}
                    >
                      {events.map((item: any) => (
                        <Option value={item[2].toString()} key={item[2].toString()}>
                          {item[0].toString()}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </fieldset>
                <img
                  src={isLightMode ? refreshIconDark : refreshIcon}
                  alt="Refetch Image"
                  onClick={handleRefresh}
                />
              </div>

              <div className={s.input}>
                <fieldset className={cn(s.fakeBorder, s.file)}>
                  <legend className={s.fakeBorder__text}>Upload users addresses and emails</legend>
                  <label className={s.fileBtn} htmlFor="table">
                    Browse
                  </label>
                  <span className={s.fileName}>{fileName}</span>
                  <input
                    className={cn(s.amountInput, s.invisible)}
                    type="file"
                    id="table"
                    onChange={onChange}
                  />
                </fieldset>

                {fileError && <div className={s.error}>File must have xlsx extension</div>}
              </div>
            </div>
            <div>
              *Please upload an excel sheet field in the following format Column 1 - event
              attendee’s email, Column 2 - Event attendee’s Godwoken wallet addresses
            </div>

            <div className={s.actionBtnWrapp}>
              <button disabled={isSaveBtnActive} className="btn primary" onClick={makeDrop}>
                {'Launch drop'}
              </button>
            </div>
          </>
        ) : !eventsActive && eventsLoading ? (
          <Skeleton active />
        ) : (
          <div className={s.noImage}>There are no events</div>
        )}
      </div>

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

        {isWaitingModalVisible && <WaitingModal setIsModalVisible={setIsModalSalesSettings} />}
      </ModalContainer>
    </div>
  );
};

export default ManageDrop;
