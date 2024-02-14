import React, { useState } from 'react';
import { Button, Nav, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';

function NavbarComponent() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleOffcanvasShow = () => setShowOffcanvas(true);
  const handleOffcanvasClose = () => setShowOffcanvas(false);
  // Check if the token is present in the local storage
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
  };

  const handleCloseOffcanvas = () => {
    handleOffcanvasClose();
  };

  return (
    <>
      {/* Offcanvas */}
      <Offcanvas show={showOffcanvas} onHide={handleOffcanvasClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><Nav.Link href='#home' onClick={handleCloseOffcanvas}>JJCK Realty Services</Nav.Link></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="#listing" onClick={handleCloseOffcanvas}>Listings</Nav.Link>
            <Nav.Link href="#contact" onClick={handleCloseOffcanvas}>Contact Us</Nav.Link>
            <Nav.Link href="#all-listings" onClick={handleCloseOffcanvas} as={Link} to="/listings">View all listings</Nav.Link>
            {token ? (
              <>
                <Nav.Link as={Link} to="/myaccount" onClick={handleCloseOffcanvas}>My Account</Nav.Link>
                <Button className='m-1' variant="primary" as={Link} to="/" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button className='m-1' variant="primary" as={Link} to="/login">
                Login
              </Button>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Button to toggle Offcanvas */}
      {!showOffcanvas && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: '999' }}>
          <Button className='m-1' variant="primary" onClick={handleOffcanvasShow}>
            <Icon.MenuApp />
          </Button>
        </div>
      )}
    </>
  );
}

export default NavbarComponent;
