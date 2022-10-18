import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import s from './ForgotPassword.module.scss';
import { BASE_URL } from '@utils/constants';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import AppContext from '@modules/layout/context/AppContext';
import { toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ForgotPassword = ({}) => {
  const [emailSent, setEmailSent] = useState(false);

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
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
    }),
    onSubmit: async () => {
      try {
        const { data } = await axios.post(`${BASE_URL}/users/forgot`, {
          email: values.email,
        });
        console.log('data', data);
        setEmailSent(true);

        toast.success(`${data.message}`, {
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
        console.log('Error uploading file:', error);
        //@ts-ignore
        if (error.response && error.response.data && error.response.data.message) {
          //@ts-ignore
          toast.error(error.response.data.message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    },
  });

  return (
    <div className="container h100">
      {emailSent ? (
        <div className={s.inner}>
          <div className={s.link_created}>An email with reset instructions is on its way</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={s.inner}>
          <h4 className={s.title}>Forgot password</h4>

          <div className={s.input_wrapper}>
            <fieldset className={cn(s.fakeBorder, s.titleInput)}>
              <legend className={s.fakeBorder__text}>Email</legend>
              <input
                className={cn(s.amountInput, s.titleInput)}
                onChange={handleChange}
                value={values.email}
                name="email"
                id="email"
              />
            </fieldset>

            {errors.email && touched.email && <span className={s.error}>{errors.email}</span>}
          </div>

          <div className={s.actionBtnWrapp}>
            <button className="btn primary" type="submit">
              {'Get reset link'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
