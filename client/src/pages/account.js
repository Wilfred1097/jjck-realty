import React, { useState } from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { FaAlignJustify } from "react-icons/fa";

function MyAccount() {
    const [showMenu, setShowMenu] = useState(false);

    const handleClose = () => setShowMenu(false);
    const handleShow = () => setShowMenu(true);

    return (
        <>
            <button className="btn btn-success m-2" onClick={handleShow}>
            <FaAlignJustify />
            </button>

            <Offcanvas show={showMenu} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><Nav.Link href='/#home'>Account</Nav.Link></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Nav.Link href="#dummy-link-2">My Bill</Nav.Link>
                        <Nav.Link href="#dummy-link-1">Account Information</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default MyAccount;
