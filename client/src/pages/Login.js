import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Navbar } from 'react-bootstrap';
import { LoginValidationSchema } from '../validation/LoginRegistration';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: values.email,
        password: values.password,
      }, { withCredentials: true });
  
      if (response.status === 200 && response.data.status === 'Success') {
        const token = response.data.token;
  
        // Store the token in localStorage or a secure storage mechanism
        localStorage.setItem('token', token);
  
        navigate('/');
        console.log('Login Successful');
      } else if (response && response.data && response.data.status === 'InvalidCredentials') {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  

  return (
    <>
      <Navbar bg="light" expand="lg" fixed="sticky-top">
        <Container fluid>
          <Navbar.Brand href="/" className="m-1">JJCK REALTY SERVICES</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="d-flex align-items-center justify-content-center mt-5">
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <h2 className="text-center">Login</h2>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginValidationSchema}
              onSubmit={handleLogin}
            >
              {() => (
                <Form>
                  <div className="mb-2">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter Email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-4">Login</button>
                </Form>
              )}
            </Formik>

            <p className="text-center pt-4">Not Registered?<a href="/register" style={{ textDecoration: 'none'}}> Register here.</a></p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;
