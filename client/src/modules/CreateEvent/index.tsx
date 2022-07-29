import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Input, Select, Tabs, Tooltip, DatePicker, Space, DatePickerProps } from 'antd';
import cn from 'classnames';
import s from './CreateEvent.module.scss';
import { BASE_URL, LINKS_NFT_ADDRESS } from '@utils/constants';
import { usePoapLinksSignContract } from '@modules/common/hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { buildQueryGodwoken } from '@utils/contracts';
import { useMutation } from 'react-query';
import { ADD_EVENT_KEY } from '@utils/queryKeys';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import ModalContainer from '@modules/look/ModalContainer';
import ErrorModal from '@modules/look/Wallet/ErrorModal';
import WaitingModal from '@modules/look/Wallet/WaitingModal';
import axios from 'axios';
import AppContext from '@modules/layout/context/AppContext';

const { TextArea } = Input;

const CreateEvent = ({}) => {
  const { account } = useWeb3React();
  const { authToken } = useContext(AppContext);

  //@ts-ignore
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

  const [fileUrl, setFileUrl] = useState<string>('');
  const [formInput, updateFormInput] = useState({
    email: '',
    name: '',
    description: '',
    address: '',
  });
  const [isModalSalesSettings, setIsModalSalesSettings] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);

  const {
    createEvent: addEventQuery,
    hasRole: hasRoleQyery,
    estimateGas: { addEvent: addEventEstimates },
  } = usePoapLinksSignContract(LINKS_NFT_ADDRESS, true);

  const errorModalCloseBtn = useCallback(() => {
    setIsModalSalesSettings(false);
    setIsErrorModalVisible(false);
  }, []);

  const { data: addEventTx, mutateAsync: addEvent, isLoading: isAddEventLoading } = useMutation(
    `${ADD_EVENT_KEY}_${formInput.email}_${formInput.name}_${fileUrl}`,
    (cid: string): Promise<any> =>
      buildQueryGodwoken(
        addEventQuery,
        [account, formInput.name, formInput.description, formInput.email, cid],
        500000,
      ),
    {
      onError: (err) =>
        console.log(err, `${ADD_EVENT_KEY}_${formInput.email}_${formInput.name}_${fileUrl}`),
    },
  );

  const isStartAuctionBtnActive = useMemo(() => {
    if (!authToken) return true;
    // if (!account || !isRoleAdmin) return true;
    return false;
  }, [authToken]);
  // }, [account, isRoleAdmin]);

  const setImage = async (e: any) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  const createEvent = async () => {
    const { name, description, email, address } = formInput;

    if (!name || !description || !email || !fileUrl || !address) return;

    setIsWaitingModalVisible(true);
    setIsModalSalesSettings(true);

    const dataToIpfs = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(dataToIpfs);
      const cid = added.path;

      const { data } = await axios.post(
        `${BASE_URL}/events`,
        {
          eventName: name,
          eventDescription: description,
          eventUri: cid,
          email,
          eventImage: fileUrl,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const { data: mailData } = await axios.post(`${BASE_URL}/sendmail`, {
        to: email,
        subject: 'Nft-Memo event',
        html: `</br > <br /> Your request to create an ${name} event is being processed. You will receive an email within 24 hours with a response.`,
      });

      setIsWaitingModalVisible(false);
      setIsModalSalesSettings(false);

      setFileUrl('');
      updateFormInput({
        email: '',
        name: '',
        description: '',
        address: '',
      });
    } catch (error) {
      setIsWaitingModalVisible(false);
      setIsModalSalesSettings(false);
      setIsErrorModalVisible(true);
      console.log('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
      <div className={s.inner}>
        <h4 className={s.title}>Create event</h4>
        <h5 className={s.subTitle}>Event title</h5>
        <div className={cn(s.amount)}>
          <Input
            className={s.amountInput}
            value={formInput.name}
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          />
        </div>

        <h5 className={s.subTitle}>Event description</h5>

        <div className={cn(s.amount)}>
          <TextArea
            className={s.areaInput}
            value={formInput.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
        </div>

        <h5 className={s.subTitle}>Your wallet address</h5>
        <div className={cn(s.amount)}>
          <Input
            className={s.amountInput}
            value={formInput.address}
            onChange={(e) => updateFormInput({ ...formInput, address: e.target.value })}
          />
        </div>

        <div className={s.inputs}>
          <div className={s.input}>
            <h5 className={s.subTitle}>Upload image</h5>

            <div className={cn(s.amount)}>
              <Input className={s.amountInput} type="file" onChange={setImage} />
            </div>
          </div>
          <div className={s.input}>
            <h5 className={s.subTitle}>Email</h5>

            <div className={cn(s.amount)}>
              <Input
                className={s.amountInput}
                value={formInput.email}
                onChange={(e) => updateFormInput({ ...formInput, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={s.actionBtnWrapp}>
          <button disabled={isStartAuctionBtnActive} className="btn primary" onClick={createEvent}>
            {'Create'}
          </button>
        </div>
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

        {isWaitingModalVisible && (
          <WaitingModal
            text="Your event has been submitted for approval. Please check your inbox and expect up to 24 hours for event's approval.
"
            setIsModalVisible={setIsModalSalesSettings}
          />
        )}
      </ModalContainer>
    </div>
  );
};

export default CreateEvent;
