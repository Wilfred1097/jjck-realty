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
          <Navbar.Brand href="/" className="p-0">
            JJCK REALTY SERVICES
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="d-flex align-items-center justify-content-center" style={{ marginTop: '80px'}}>
        <Card style={{ width: '400px', height: '570px' }}>
          <Card.Body>
            <h2 className="text-center">Customer Sign up</h2>
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
                    <BootstrapForm.Label style={{fontSize: '13px'}}>Complete Name</BootstrapForm.Label>
                    <Field
                      type="text"
                      id="completename"
                      name="completename"
                      className="form-control"
                      placeholder="Enter complete name"
                      style={{fontSize: '13px'}}
                    />
                    <ErrorMessage name="completename" component="div" className="text-danger"  style={{ fontSize: '13px'}}/>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicAddress">
                    <BootstrapForm.Label style={{fontSize: '13px'}}>Address</BootstrapForm.Label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="form-control"
                      placeholder="Address"
                      style={{fontSize: '13px'}}
                    />
                    <ErrorMessage name="address" component="div" className="text-danger"  style={{ fontSize: '13px'}}/>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicBirthdate">
                    <BootstrapForm.Label style={{fontSize: '13px'}}>Birthdate</BootstrapForm.Label>
                    <Field
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      className="form-control"
                      style={{fontSize: '13px'}}
                    />
                    <ErrorMessage name="birthdate" component="div" className="text-danger"  style={{ fontSize: '13px'}}/>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicEmail">
                    <BootstrapForm.Label style={{fontSize: '13px'}}>Email</BootstrapForm.Label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter Email"
                      style={{fontSize: '13px'}}
                    />
                    <ErrorMessage name="email" component="div" className="text-danger"  style={{ fontSize: '13px'}}/>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicPassword">
                    <BootstrapForm.Label style={{fontSize: '13px'}}>Password</BootstrapForm.Label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      style={{fontSize: '13px'}}
                    />
                    <ErrorMessage name="password" component="div" className="text-danger"  style={{ fontSize: '13px'}}/>
                  </BootstrapForm.Group>

                  <BootstrapForm.Group controlId="formBasicConfirmPassword">
                    <BootstrapForm.Label style={{fontSize: '13px'}}>Confirm Password</BootstrapForm.Label>
                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      style={{fontSize: '13px'}}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger"  style={{ fontSize: '13px'}}/>
                  </BootstrapForm.Group>

                  <Button variant="success" type="submit" className="w-100 mt-3" style={{ fontSize: '13px'}}>
                    Sign up
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="text-center pt-4" style={{fontSize: '13px'}}>
              Already Registered?<a href="/login" style={{ textDecoration: 'none', color: 'green' }}>
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
