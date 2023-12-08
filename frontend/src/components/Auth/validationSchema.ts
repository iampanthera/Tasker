import * as Yup from 'yup';

export const validationSchema = (isLogin: Boolean) => {
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
