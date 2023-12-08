import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { login, register } from '../../api/authApi';
import { validationSchema } from '../../components/Auth/validationSchema';
import { AuthForm } from '../../components/Auth/AuthForm';

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
          <AuthForm formik={formik} isLogin={isLogin} />
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
