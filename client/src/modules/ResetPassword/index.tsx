import { useState } from 'react';
import cn from 'classnames';
import s from './ResetPassword.module.scss';
import { BASE_URL } from '@utils/constants';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import AppContext from '@modules/layout/context/AppContext';
import { toast } from 'react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router';

const ResetPassword = ({}) => {
  const [emailSent, setEmailSent] = useState(false);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

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
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required(),
    }),
    onSubmit: async () => {
      try {
        console.log('values.password', values.password);

        const { data } = await axios.patch(`${BASE_URL}/users/reset`, {
          password: values.password,
          id,
        });
        console.log('data', data);
        setEmailSent(true);

        toast.success(`Your password was successfully restored`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        resetForm();
        setTimeout(() => {
          history.push('/');
        }, 1000);
      } catch (error) {
        toast.error("Email wasn't updated", {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log('Error uploading file:', error);
      }
    },
  });

  return (
    <div className="container h100">
      {emailSent ? (
        <div className={s.inner}>
          <div className={s.link_created}>Password updated</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={s.inner}>
          <h4 className={s.title}>Reset password</h4>

          <div className={s.input_wrapper}>
            <fieldset className={cn(s.fakeBorder, s.titleInput)}>
              <legend className={s.fakeBorder__text}>Password</legend>
              <input
                className={cn(s.amountInput, s.titleInput)}
                onChange={handleChange}
                value={values.password}
                type="password"
                name="password"
                id="password"
              />
            </fieldset>

            {errors.password && touched.password && (
              <span className={s.error}>{errors.password}</span>
            )}
          </div>

          <div className={s.actionBtnWrapp}>
            <button className="btn primary" type="submit">
              {'Reset password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
