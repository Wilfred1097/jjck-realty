import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarComponent() {
  // Check if the token is present in the local storage
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="#" className='m-1'>JJCK REALTY SERVICES</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="mx-auto m-1">
            <Nav.Link href="#listing">Listings</Nav.Link>
            <Nav.Link href="#contact">Contact Us</Nav.Link>
          </Nav>
          <Nav>
            {/* Check if token is present */}
            {token ? (
              <Button className='m-1' variant="primary" as={Link} to="/" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button className='m-1' variant="primary" as={Link} to="/login">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
