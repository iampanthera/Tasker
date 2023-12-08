import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { login, register } from '../../api/authApi';
import { toast } from 'react-toastify';

const validationSchema = (isLogin: Boolean) => {
  const commonValidation = {
    password: Yup.string().required('Password is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  };

  if (isLogin) {
    return Yup.object().shape({
      ...commonValidation,
    });
  }

  return Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    ...commonValidation,
  });
};

export default function Auth({ isLogin = false }: { isLogin?: boolean }) {
  const [_, setCookie] = useCookies(['authToken']);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema(isLogin),
    onSubmit: async (values) => {
      try {
        if (isLogin) {
          const res = await login({
            email: values.email,
            password: values.password,
          });
          const { token } = res;
          setCookie('authToken', token);
          formik.resetForm();
          toast.success('Logged in successfully');
          navigate('/home');
        } else {
          await register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          });
          formik.resetForm();
          toast.success('Account created successfully. Please log in.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  console.log({ er: formik.errors });

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img
            className='mx-auto h-10 w-auto'
            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
            alt='Your Company'
          />
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            {isLogin ? 'Sign in to your account' : 'Register for an account'}
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            className='space-y-3'
            onSubmit={formik.handleSubmit}
            method='POST'
          >
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    First Name
                  </label>
                  <div className='mt-2'>
                    <input
                      id='firstName'
                      name='firstName'
                      type='firstName'
                      autoComplete='firstName'
                      required
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className='text-red-500'>
                      {formik.errors.firstName}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Last Name
                  </label>
                  <div className='mt-2'>
                    <input
                      id='lastName'
                      name='lastName'
                      type='lastName'
                      autoComplete='lastName'
                      required
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className='text-red-500'>{formik.errors.lastName}</div>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className='text-red-500'>{formik.errors.email}</div>
              )}
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Password
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className='text-red-500'>{formik.errors.password}</div>
              )}
            </div>

            {!isLogin && (
              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Confirm Password
                  </label>
                </div>
                <div className='mt-2'>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    autoComplete='current-confirmPassword'
                    required
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className='text-red-500'>
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>
            )}
            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>
          <div className='mt-4 text-center'>
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <Link
                  to='/register'
                  className='text-indigo-600 hover:underline'
                >
                  Sign up here.
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link to='/login' className='text-indigo-600 hover:underline'>
                  Log in here.
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
