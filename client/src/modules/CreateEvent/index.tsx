import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Input } from 'antd';
import cn from 'classnames';
import s from './CreateEvent.module.scss';
import { BASE_URL } from '@utils/constants';
import { useWeb3React } from '@web3-react/core';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import ModalContainer from '@modules/look/ModalContainer';
import ErrorModal from '@modules/look/Wallet/ErrorModal';
import WaitingModal from '@modules/look/Wallet/WaitingModal';
import axios from 'axios';
import AppContext from '@modules/layout/context/AppContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { isAddress } from '@ethersproject/address';
import { ToastContainer, toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';

const { TextArea } = Input;

const CreateEvent = ({}) => {
  const { authToken } = useContext(AppContext);

  //@ts-ignore
  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

  const [isModalSalesSettings, setIsModalSalesSettings] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);

  const errorModalCloseBtn = useCallback(() => {
    setIsModalSalesSettings(false);
    setIsErrorModalVisible(false);
  }, []);

  const isSubmitBtnActive = useMemo(() => {
    if (!authToken) return true;
    // if (!account || !isRoleAdmin) return true;
    return false;
  }, [authToken]);
  // }, [account, isRoleAdmin]);

  const {
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    resetForm,
    errors,
    values,
  } = useFormik({
    initialValues: {
      title: '',
      description: '',
      email: '',
      address: '',
      img: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().label('Title').required(),
      description: Yup.string().label('Description').required(),
      email: Yup.string().email().required(),
      img: Yup.mixed().required('Image is required'),
      address: Yup.string()
        .label('Wallet address')
        .required()
        //@ts-ignore
        .test('Is address', 'Please enter correct wallet address', (value) => isAddress(value)),
    }),
    onSubmit: async () => {
      setIsWaitingModalVisible(true);
      setIsModalSalesSettings(true);

      const dataToIpfs = JSON.stringify({
        name: values.title,
        description: values.description,
        image: values.img,
      });

      try {
        const added = await client.add(dataToIpfs);
        const cid = added.path;

        const { data } = await axios.post(
          `${BASE_URL}/events`,
          {
            eventName: values.title,
            eventDescription: values.description,
            eventUri: cid,
            email: values.email,
            eventImage: values.img,
            address: values.address,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const { data: mailData } = await axios.post(`${BASE_URL}/sendmail`, {
          to: values.email,
          subject: 'Nft-Memo event',
          html: `</br > <br /> Your request to create an ${values.title} event is being processed. You will receive an email within 24 hours with a response.`,
        });

        setIsWaitingModalVisible(false);
        setIsModalSalesSettings(false);

        toast.success('Event created', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        resetForm();
      } catch (error) {
        toast.error('Event have not created', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsWaitingModalVisible(false);
        setIsModalSalesSettings(false);
        setIsErrorModalVisible(true);
        console.log('Error uploading file:', error);
      }
    },
  });

  const setImage = async (e: any) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      setFieldValue('img', url);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className={s.inner}>
        <h4 className={s.title}>Create event</h4>
        <h5 className={s.subTitle}>Event title</h5>
        <div className={cn(s.amount)}>
          <Input
            className={s.amountInput}
            onChange={handleChange}
            value={values.title}
            name="title"
            id="title"
          />
        </div>
        {errors.title && touched.title && <span className={s.error}>{errors.title}</span>}

        <h5 className={s.subTitle}>Event description</h5>

        <div className={cn(s.amount)}>
          <TextArea
            className={s.areaInput}
            onChange={handleChange}
            value={values.description}
            name="description"
            id="description"
          />
        </div>
        {errors.description && touched.description && (
          <span className={s.error}>{errors.description}</span>
        )}

        <h5 className={s.subTitle}>Your wallet address</h5>
        <div className={cn(s.amount)}>
          <Input
            className={s.amountInput}
            onChange={handleChange}
            value={values.address}
            name="address"
            id="address"
          />
        </div>
        {errors.address && touched.address && <span className={s.error}>{errors.address}</span>}

        <div className={s.inputs}>
          <div className={s.input}>
            <h5 className={s.subTitle}>Upload image</h5>

            <div className={cn(s.amount)}>
              <Input
                className={s.amountInput}
                type="file"
                onChange={setImage}
                name="img"
                id="img"
              />
            </div>
            {errors.img && touched.img && <span className={s.error}>{errors.img}</span>}
          </div>
          <div className={s.input}>
            <h5 className={s.subTitle}>Email</h5>

            <div className={cn(s.amount)}>
              <Input
                className={s.amountInput}
                onChange={handleChange}
                value={values.email}
                name="email"
                id="email"
              />
            </div>
            {errors.email && touched.email && <span className={s.error}>{errors.email}</span>}
          </div>
        </div>

        <div className={s.actionBtnWrapp}>
          <button disabled={isSubmitBtnActive} type="submit" className="btn primary">
            {/* <button disabled={isSubmitBtnActive} className="btn primary" onClick={createEvent}> */}
            {'Create'}
          </button>
        </div>
      </form>
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
      <ToastContainer theme="colored" />
    </div>
  );
};

export default CreateEvent;
