import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Card, Navbar, Form as BootstrapForm, Button } from 'react-bootstrap';

const ForgotPassword = () => {
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleCheckEmailValidity = async (email) => {
    try {
      const response = await axios.post('https://jjck-realty-services-server.onrender.com/check-email-exists', { email });

      if (response.status === 200 && response.data.exists) {
        setIsEmailValid(true);
      } else {
        setIsEmailValid(false);
        alert('Invalid email. Please check your email address.');
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      if (!isEmailValid) {
        alert('Please check the validity of your email address first.');
        return;
      }

      const response = await axios.post('https://jjck-realty-services-server.onrender.com/forgot-password', values);

      if (response.status === 200 && response.data.status === 'Success') {
        alert('Password reset email sent successfully. Check your email for further instructions.');
      } else {
        console.error('Unexpected response:', response);
        alert('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error in forgot password:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      {/* Navbar (if needed) */}
      {/* ... */}

      <Container className="d-flex align-items-center justify-content-center mt-5">
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <h2 className="text-center">Forgot Password</h2>
            <Formik
              initialValues={{
                email: '',
              }}
              onSubmit={handleForgotPassword}
            >
              {() => (
                <Form>
                  <BootstrapForm.Group controlId="formBasicEmail">
                    <BootstrapForm.Label>Email</BootstrapForm.Label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      onChange={(e) => handleCheckEmailValidity(e.target.value)}
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  <Button variant="primary" type="submit" className="w-100 mt-4">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Add a link to navigate back to the login page if needed */}
            <p className="text-center pt-4">
              Remembered your password? <a href="/login">Login here.</a>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ForgotPassword;
