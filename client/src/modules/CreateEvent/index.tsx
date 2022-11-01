import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';
import { formatFileName } from '@utils/index';
import { useAuth } from '@modules/common/hooks';

const CreateEvent = ({}) => {
  const { authToken } = useContext(AppContext);
  const { account } = useWeb3React();
  const { userEmail } = useAuth();

  const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization:
        'Basic ' +
        Buffer.from(
          '2DFiT3mPc7k4X4iyUA29ClV8YU8' + ':' + '8e0ab35d42b46d27db76ebc3bfb5125f',
        ).toString('base64'),
    },
  });

  const [fileName, setFileName] = useState<string>('');
  const [isModalSalesSettings, setIsModalSalesSettings] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [isWaitingModalVisible, setIsWaitingModalVisible] = useState<boolean>(false);
  const [fileError, setFileError] = useState<boolean>(false);

  const errorModalCloseBtn = useCallback(() => {
    setIsModalSalesSettings(false);
    setIsErrorModalVisible(false);
  }, []);

  const isSubmitBtnActive = useMemo(() => {
    if (!authToken) return true;
    return false;
  }, [authToken]);

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
      img: Yup.string().nullable().required('Image is required'),
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
          subject: 'Power Ups event',
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
        setFileName('');
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

  useEffect(() => {
    if (account) {
      setFieldValue('address', account);
    }
  }, [account]);

  useEffect(() => {
    if (userEmail) {
      setFieldValue('email', userEmail);
    }
  }, [userEmail]);

  const setImage = async (e: any) => {
    const file = e.target.files[0];

    if (
      file.name.includes('.jpg') ||
      file.name.includes('.jpeg') ||
      file.name.includes('.png') ||
      file.name.includes('.gif')
    ) {
      setFileError(false);
    } else {
      setFileError(true);
      setFileName('');
      return;
    }

    setFileError(false);

    setFileName(file.name);

    try {
      const added = await client.add(file);

      const url = `https://nft-memo.infura-ipfs.io/ipfs/${added.path}`;

      setFieldValue('img', url);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className={s.inner}>
        <h4 className={s.title}>Create event</h4>

        <div className={s.allInputsWrapper}>
          <div>
            <fieldset className={cn(s.fakeBorder, s.titleInput)}>
              <legend className={s.fakeBorder__text}>Event title</legend>
              <input
                className={cn(s.amountInput, s.titleInput)}
                onChange={handleChange}
                value={values.title}
                name="title"
                id="title"
              />
            </fieldset>

            {errors.title && touched.title && <span className={s.error}>{errors.title}</span>}
          </div>

          {/* <h5 className={s.subTitle}>Event description</h5> */}

          <div>
            <fieldset className={cn(s.fakeBorder, s.area)}>
              <legend className={s.fakeBorder__text}>Event Description</legend>
              <textarea
                className={s.areaInput}
                onChange={handleChange}
                value={values.description}
                name="description"
                id="description"
              />
            </fieldset>

            {errors.description && touched.description && (
              <span className={s.error}>{errors.description}</span>
            )}
          </div>

          <div>
            <fieldset className={s.fakeBorder}>
              <legend className={s.fakeBorder__text}>Your wallet address</legend>
              <input
                className={s.amountInput}
                onChange={handleChange}
                value={values.address}
                name="address"
                id="address"
              />
            </fieldset>

            {errors.address && touched.address && <span className={s.error}>{errors.address}</span>}
          </div>

          <div className={s.inputs}>
            <div className={s.input}>
              <fieldset className={cn(s.fakeBorder, s.file)}>
                <legend className={s.fakeBorder__text}>Upload image</legend>
                <label className={s.fileBtn} htmlFor="img">
                  Browse
                </label>
                <span className={s.fileName}>{formatFileName(fileName)}</span>
                <input
                  className={cn(s.amountInput, s.invisible)}
                  type="file"
                  onChange={setImage}
                  name="img"
                  id="img"
                />
              </fieldset>
              {errors.img && touched.img && <span className={s.error}>{errors.img}</span>}
              {fileError && (
                <div className={s.error}>
                  File extension is not supported. Supported extensions are jpg,png,jpeg,gif
                </div>
              )}
            </div>
            <div className={s.input}>
              <fieldset className={s.fakeBorder}>
                <legend className={s.fakeBorder__text}>Email</legend>
                <input
                  className={s.amountInput}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  id="email"
                />
              </fieldset>

              {errors.email && touched.email && <span className={s.error}>{errors.email}</span>}
            </div>
          </div>

          <div className={s.actionBtnWrapp}>
            <button disabled={isSubmitBtnActive} type="submit" className="btn primary">
              {'Create'}
            </button>
          </div>
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
            text="Your event has been submitted for approval. Please check your inbox and expect up to 24 hours for event's approval."
            setIsModalVisible={setIsModalSalesSettings}
          />
        )}
      </ModalContainer>
    </div>
  );
};

export default CreateEvent;
