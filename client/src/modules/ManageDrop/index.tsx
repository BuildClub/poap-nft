import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Input, Select, Tabs, Tooltip, DatePicker, Space, DatePickerProps, Skeleton } from 'antd';
import cn from 'classnames';
import s from './ManageDrop.module.scss';
import { LINKS_NFT_ADDRESS, BASE_URL } from '@utils/constants';
import {
  usePoapLinksSignContract,
  usePoapLinksUnsignContract,
} from '@modules/common/hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { buildQueryGodwoken } from '@utils/contracts';
import { useMutation, useQuery } from 'react-query';
import { ADD_EVENT_KEY, EVENTS_LIST_KEY, SET_EVENT_MINTERS_KEY } from '@utils/queryKeys';
import { create as ipfsHttpClient } from 'ipfs-http-client';
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

const { TextArea } = Input;
const { Option } = Select;

const ManageDrop = ({}) => {
  const { account, chainId, library } = useWeb3React();

  const { isLightMode } = useContext(AppContext);

  //@ts-ignore
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

  const [fileUrl, setFileUrl] = useState<string>('');
  const [eventId, setEventId] = useState<number | null>(null);
  const [eventsActive, setEventsActive] = useState<boolean>(false);
  const [isEventOwner, setIsEventOwner] = useState<boolean>(false);
  const [fileError, setFileError] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);
  const [emails, selEmails] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isModalSalesSettings, setIsModalSalesSettings] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);

  const { allEvents: allEventsQuery } = usePoapLinksUnsignContract(LINKS_NFT_ADDRESS, true);

  const { data: eventsList, isLoading: isEventsListLoading, refetch: refetchEventsList } = useQuery(
    EVENTS_LIST_KEY,
    (): Promise<any> => buildQueryGodwoken(allEventsQuery, [], 500000),
    {
      onError: (err) => console.log(err, EVENTS_LIST_KEY),
    },
  );

  const { addUserToEvent: setEventMintersQuery } = usePoapLinksSignContract(
    LINKS_NFT_ADDRESS,
    true,
  );

  const errorModalCloseBtn = useCallback(() => {
    setIsModalSalesSettings(false);
    setIsErrorModalVisible(false);
  }, []);

  const {
    data: setEventMintersTx,
    mutateAsync: setEventMinters,
    isLoading: isSetEventMintersLoading,
  } = useMutation(
    `${SET_EVENT_MINTERS_KEY}_${eventId}`,
    (): Promise<any> =>
      //@ts-ignore
      buildQueryGodwoken(setEventMintersQuery, [users, +eventId], 500000),
    {
      onError: (err) => console.log(err, `${SET_EVENT_MINTERS_KEY}_${eventId}`),
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
    // console.log('eventsList', eventsList);
    if (eventsList && eventsList.length > 1 && account) {
      let filtredEvents = eventsList.filter(
        (item: any) =>
          item[2].toString() !== '0' && item[4].toLowerCase() === account.toLowerCase(),
      );

      if (filtredEvents.length === 0) {
        setEventsActive(false);
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
    }
  }, [eventsList, account]);

  const isSaveBtnActive = useMemo(() => {
    if (!account || !isEventOwner || users.length === 0) return true;
    return false;
  }, [account, isEventOwner, users]);

  const makeDrop = async () => {
    if (users.length === 0 || !isEventOwner) return;

    try {
      setIsWaitingModalVisible(true);
      setIsModalSalesSettings(true);
      await setEventMinters();

      setTimeout(async () => {
        const { data } = await axios.post(`${BASE_URL}/sendmail`, {
          to: emails,
          subject: 'You have received the memo nft',
          html:
            '</br > <br /> Here is the link of the memo nft : <a href="https://nft-memo-v2.herokuapp.com">Look at your nft</a><br /><br /> Best Regards.',
        });
        setIsWaitingModalVisible(false);
        setIsModalSalesSettings(false);
      }, 40000);
    } catch (error) {
      setIsWaitingModalVisible(false);
      setIsModalSalesSettings(false);
      setIsErrorModalVisible(true);
      console.log('Error setEventMinters:', error);
    }
  };

  const setEvent = (e: number) => {
    // console.log('Set Event', e);
    setEventId(e);
  };

  const onChange = (e: any) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    if (!file.name.includes('.xlsx')) {
      console.log('File is not xlsx');
      setFileError(true);
      return;
    }

    setFileError(false);

    reader.onload = (evt) => {
      //@ts-ignore
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // console.log('ws', ws);

      //@ts-ignore
      const dataJson = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log('dataJson', dataJson);
      //@ts-ignore
      const usersEmails = dataJson.map((item) => item[0]);
      //@ts-ignore
      const usersAddresses: string[] = dataJson.map((item) => item[1]);

      selEmails(usersEmails);
      setUsers(usersAddresses);
    };
    reader.readAsBinaryString(file);
  };

  if (isEventsListLoading) {
    return (
      <div className="container h100">
        <div className={s.inner}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className="container h100">
      <div className={s.inner}>
        <h4 className={s.title}>Manage drop</h4>

        {eventsActive && (
          <>
            <div className={s.titleWrapper}>
              <h5 className={s.subTitle}>Select event</h5>
              <img
                src={isLightMode ? refreshIconDark : refreshIcon}
                alt="Refetch Image"
                onClick={handleRefresh}
              />
            </div>
            <div className={'custom-select events'}>
              <Select defaultValue={events[0][0].toString()} onChange={(value) => setEvent(value)}>
                {events.map((item: any) => (
                  <Option value={item[2].toString()} key={item[2].toString()}>
                    {item[0].toString()}
                  </Option>
                ))}
              </Select>
            </div>

            <h5 className={s.subTitle}>
              Upload users addresses and emails{' '}
              <Tooltip
                placement="bottomLeft"
                trigger={'hover'}
                title={
                  "Please upload an excel sheet filled in the following format: Column 1 - event attendee's email Column 2 - event attendee's wallet address"
                }
                overlayClassName={s.nftCards__tooltip}
              >
                <i className={'icon-exclamation'} />
              </Tooltip>
            </h5>

            <div className={cn(s.amount)}>
              <Input className={s.amountInput} type="file" onChange={onChange} />
            </div>
            {fileError && <div className={s.error}>File must have xlsx extension</div>}
            {/* <div className={cn(s.amount)}>
              <TextArea
                className={s.areaInput}
                value={users}
                onChange={(e) => setUsers(e.target.value)}
              />
            </div> */}
            <div className={s.actionBtnWrapp}>
              <button disabled={isSaveBtnActive} className="btn primary" onClick={makeDrop}>
                {'Save drop'}
              </button>
            </div>
          </>
        )}
        {!eventsActive && <div className={s.noImage}>There are no events</div>}
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
      <ToastContainer theme="colored" />
    </div>
  );
};

export default ManageDrop;
