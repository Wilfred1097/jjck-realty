import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Navbar, Form as BootstrapForm, Button } from 'react-bootstrap';
import { RegistrationValidationSchema } from '../validation/LoginRegistration'

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      const response = await axios.post('http://localhost:3001/register', values, { withCredentials: true });

      if (response.status === 200 && response.data.status === 'Success') {
        navigate('/login');
      } else if (response && response.data && response.data.status === 'Email already exists') {
        alert(response.data.status);
      } else {
        console.error('Unexpected response:', response);
        alert('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        alert(error.errors);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" fixed="sticky-top">
        <Container fluid>
          <Navbar.Brand href="/" className="m-1">
            JJCK REALTY SERVICES
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="d-flex align-items-center justify-content-center mt-5">
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <h2 className="text-center">Register</h2>
            <Formik
              initialValues={{
                completename: '',
                birthdate: '',
                address: '',
                email: '',
                password: '',
              }}
              validationSchema={RegistrationValidationSchema}
              onSubmit={handleRegister}
            >
              {() => (
                <Form>
                  <BootstrapForm.Group controlId="formBasicName">
                    <BootstrapForm.Label>Complete Name</BootstrapForm.Label>
                    <Field
                      type="text"
                      id="completename"
                      name="completename"
                      className="form-control"
                      placeholder="Enter complete name"
                    />
                    <ErrorMessage name="completename" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicAddress">
                    <BootstrapForm.Label>Address</BootstrapForm.Label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                      placeholder="Address"
                    />
                    <ErrorMessage name="address" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicBirthdate">
                    <BootstrapForm.Label>Birthdate</BootstrapForm.Label>
                    <Field
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      className="form-control"
                    />
                    <ErrorMessage name="birthdate" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicEmail">
                    <BootstrapForm.Label>Email</BootstrapForm.Label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter Email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicPassword">
                    <BootstrapForm.Label>Password</BootstrapForm.Label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicConfirmPassword">
                    <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                  </BootstrapForm.Group>

                  <Button variant="primary" type="submit" className="w-100 mt-4">
                    Register
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="text-center pt-4">
              Already Registered?<a href="/login" style={{ textDecoration: 'none' }}>
                {' '}
                Login here.
              </a>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Register;
