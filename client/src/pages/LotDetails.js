import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import TopBar from './topbar';

function LotDetailsPage() {
    const { lot_Id } = useParams();
    const [lotDetails, setLotDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);
    const token = localStorage.getItem('token');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const fetchLotDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/lots/${lot_Id}`);
                const data = await response.json();
                setLotDetails(data.lot);
            } catch (error) {
                console.error('Error fetching lot details:', error);
                // Handle error here, such as showing an error message to the user
            }
        };

        fetchLotDetails();

        // Check if the screen width is less than or equal to 768px (considered mobile view)
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [lot_Id]);

    const handleRequestTour = () => {
        if (token) {
            console.log('Request submitted');
        } else {
            setShowAlert(true);
        }
    };

    return (
        <>
            <TopBar />
            <div className="container mt-3">
                {lotDetails && !isMobileView ? (
                    <div className="d-flex justify-content-between">
                        {/* Lot Details Card */}
                        <Card style={{ width: '69%', height: '350px', overflow: 'hidden' }}>
                            <Card.Img variant="top" src={lotDetails.image} alt={lotDetails.name} style={{ maxHeight: '350px', objectFit: 'cover' }} />
                        </Card>

                        {/* Additional Card */}
                        <Card style={{ width: '30%', height: '350px' }}>
                            <Card.Body>
                                <Card.Title style={{fontSize: '27px', marginBottom: '-3px'}}>Lot Details</Card.Title><br/>
                                <Card.Text style={{ margin: 0 }}>
                                    <p style={{ margin: 0, fontSize: '15px'}}>Price: <b>&#8369;{lotDetails.price.toLocaleString()}</b></p>
                                    <p style={{ margin: 0, fontSize: '15px'}}>Dimension: <b>{lotDetails.dimension} sqm.</b></p>
                                    <p style={{ margin: 0, fontSize: '15px'}}>Block #: <b>{lotDetails.block_number}</b> | Lot #: <b>{lotDetails.lot_number}</b></p><hr />
                                </Card.Text>
                                <Card.Title style={{fontSize: '27px'}}>Request a Tour</Card.Title>
                                <Form.Group>
                                    <Form.Label>Select Date</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '14px' }}
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className='mb-3'
                                    />
                                </Form.Group>
                                <Button variant="primary" className='w-100' onClick={handleRequestTour}>Request</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ) : lotDetails ? (
                    <div>
                        {/* Lot Details Card */}
                        <Card>
                            <Card.Img variant="top" src={lotDetails.image} alt={lotDetails.name} />
                            <Card.Body>
                                <Card.Title>{lotDetails.name}</Card.Title>
                                <Card.Text>
                                    <p>Price: &#8369;{lotDetails.price.toLocaleString()}</p>
                                    <p>Dimension: {lotDetails.dimension} sqm.</p>
                                    <p>Block | Lot: {lotDetails.block_number} | {lotDetails.lot_number}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        {/* Additional Card (Request a Tour) */}
                        <Card>
                            <Card.Body>
                                <Card.Title>Request a Tour</Card.Title>
                                <Form.Group>
                                    <Form.Label>Select Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Button onClick={handleRequestTour}>Request a Tour</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            {showAlert && (
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: '1000', width: '300px' }}>
                    You must login first
                </Alert>
            )}
        </>
    );
}

export default LotDetailsPage;
