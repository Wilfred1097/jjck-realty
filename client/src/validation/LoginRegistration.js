import * as Yup from 'yup';

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const RegistrationValidationSchema = Yup.object().shape({
  completename: Yup.string().required('Complete Name is required'),
  address: Yup.string().required('Address is required'),
  birthdate: Yup.date().required('Birthdate is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).*$/, 'Password must contain at least one special character and one uppercase letter'), // Special character and uppercase validation
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match') // Ensure the confirm password matches the password
    .required('Confirm Password is required'),
});

export const resetPassword = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).*$/, 'Password must contain at least one special character and one uppercase letter'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
