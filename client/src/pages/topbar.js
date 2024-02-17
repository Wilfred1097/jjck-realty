import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TopBar() {
    // Check if the token is present in the local storage
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem('token');
        // Reload the page
        window.location.reload();
    };
    
    return (
        <Navbar bg="light" className='p-1 sticky-top'>
            <Container>
                {/* Brand Name */}
                <Navbar.Brand as={Link} to="/">JJCK Realty Services</Navbar.Brand>

                {/* Right Side Link and Button */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">
                        {token ? (
                            <Nav.Link className="mr-3" as={Link} to="/myaccount">Account</Nav.Link>
                        ) : (
                            <Nav.Link className="mr-3" as={Link} to="/login"></Nav.Link>
                        )}
                    </Nav>
                    <Nav className="ml-auto">
                        {token ? (
                            <Button variant="success" className="rounded-pill" onClick={handleLogout}><b>Logout</b></Button>
                        ) : (
                            <Button variant="success" className="rounded-pill" as={Link} to="/login"><b>Login</b></Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopBar;
