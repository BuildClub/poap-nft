import React, { useEffect, useMemo, useState } from 'react';
import { Input, Select, Tabs, Tooltip, DatePicker, Space, DatePickerProps } from 'antd';
import cn from 'classnames';
import s from './ManageDrop.module.scss';
import { LINKS_NFT_ADDRESS, SERVER_URL } from '@utils/constants';
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

const { TextArea } = Input;
const { Option } = Select;

const ManageDrop = ({}) => {
  const { account, chainId, library } = useWeb3React();

  //@ts-ignore
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

  const [fileUrl, setFileUrl] = useState<string>('');
  const [eventId, setEventId] = useState<number | null>(null);
  const [eventsActive, setEventsActive] = useState<boolean>(false);
  const [isEventOwner, setIsEventOwner] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);
  const [emails, selEmails] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const { allEvents: allEventsQuery } = usePoapLinksUnsignContract(LINKS_NFT_ADDRESS, true);

  const { data: eventsList, isLoading: isEventsList, refetch: refetchEventsList } = useQuery(
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
    console.log('eventsList', eventsList);
    if (eventsList && eventsList.length > 1 && account) {
      let filtredEvents = eventsList.filter((item: any) => item[2].toString() !== '0');

      console.log('filtredEvents', filtredEvents);

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

  const createEvent = async () => {
    if (users.length === 0 || !isEventOwner) return;

    try {
      await setEventMinters();
      // const { data } = await axios.post(`${SERVER_URL}/sendmail`, {
      //   to: emails,
      // });
      // console.log('Email data', data);

      console.log('setEventMintersTx', setEventMintersTx);
    } catch (error) {
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

  return (
    <div className="container h100">
      <div className={s.inner}>
        <h4 className={s.title}>Manage drop</h4>

        {eventsActive && (
          <>
            <h5 className={s.subTitle}>Select event</h5>
            <div className={'custom-select events'}>
              <Select defaultValue={events[0][0].toString()} onChange={(value) => setEvent(value)}>
                {events.map((item: any) => (
                  <Option value={item[2].toString()} key={item[2].toString()}>
                    {item[0].toString()}
                  </Option>
                ))}
              </Select>
            </div>
            <h5 className={s.subTitle}>Upload users addresses and emails</h5>
            <div className={cn(s.amount)}>
              <Input className={s.amountInput} type="file" onChange={onChange} />
            </div>
            {/* <div className={cn(s.amount)}>
              <TextArea
                className={s.areaInput}
                value={users}
                onChange={(e) => setUsers(e.target.value)}
              />
            </div> */}
            <div className={s.actionBtnWrapp}>
              <button disabled={isSaveBtnActive} className="btn primary" onClick={createEvent}>
                {'Save drop'}
              </button>
            </div>
          </>
        )}
        {!eventsActive && <div className={s.noImage}>There are no events</div>}
      </div>
    </div>
  );
};

export default ManageDrop;
