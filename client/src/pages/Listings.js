import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';

function ViewAllListings() {
    const [lots, setLots] = useState([]);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const lotsPerPage = 18;
    const totalPages = Math.ceil(lots.length / lotsPerPage);
    const indexOfLastLot = currentPage * lotsPerPage;
    const indexOfFirstLot = indexOfLastLot - lotsPerPage;
    const currentLots = lots.slice(indexOfFirstLot, indexOfLastLot);

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

    useEffect(() => {
        const fetchLots = async () => {
            try {
                const response = await fetch('http://localhost:3001/lots');
                const data = await response.json();
                console.log('Lots API Response:', data);
                setLots(data.lots);
            } catch (error) {
                console.error('Error fetching lots:', error);
            }
        };

        fetchLots();
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
        <Offcanvas show={showOffcanvas} onHide={handleOffcanvasClose} placement="end">
            <Offcanvas.Header closeButton>
            <Offcanvas.Title><Nav.Link href='/#home' onClick={handleCloseOffcanvas}>JJCK Realty Services</Nav.Link></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <Nav className="flex-column">
                <Nav.Link href="/#contact" onClick={handleCloseOffcanvas}>Contact Us</Nav.Link>
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
        {/* End of Offcanvas */}

        <Container className="mt-5" id='listing' fluid>
    {currentLots.map((lot, index) => (
        index % 6 === 0 && (
            <Row key={index}>
                {currentLots.slice(index, index + 6).map((lot, idx) => (
                    <Col key={idx} xs={6} md={4} lg={2} xl={2} xxl={2} className="mb-4">
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <h3>{lot.name}</h3>
                            <img src={lot.image} alt={lot.name} style={{ maxWidth: '100%', objectFit: 'cover', width: '100%', height: '100%' }} />
                            <div style={{ 
                                position: 'absolute', 
                                bottom: 0, 
                                left: 0, 
                                width: '100%', 
                                background: 'linear-gradient(transparent, rgba(0,0,0,1))',
                                color: 'white',
                                padding: '10px'
                            }}>
                                <Col style={{ fontSize: '13px'}}>
                                    {lot.description}<br />
                                    Block | Lot #: {lot.block_number} | {lot.lot_number}<br />
                                    Dimension: {lot.dimension} sqm.<br />
                                    Price: <span>&#8369;</span>{lot.price}<br />
                                </Col>
                            </div>
                        </div>
                    </Col>                
                ))}
                {currentLots.length - index < 6 && Array.from({ length: 6 - (currentLots.length - index) }).map((_, idx) => (
                    <Col key={idx} lg={2} xl={2} xxl={2} className="mb-4" />
                ))}
            </Row>
        )
    ))}
</Container>


        {/* Pagination */}
        <div className="text-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i} className="mx-1" variant="outline-primary" onClick={() => handlePageChange(i + 1)}>
                {i + 1}
            </Button>
            ))}
        </div>
        {/* End of Pagination */}

        {/* Back to Top Button */}
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1030 }}>
            <Button variant="primary" onClick={handleScrollToTop}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-arrow-up-circle"
                viewBox="0 0 16 16"
            >
                <path
                fillRule="evenodd"
                d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.646 11.854a.5.5 0 0 0 .708 0L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"
                />
            </svg>
            </Button>
        </div>
    </>
    )
}

export default ViewAllListings;
