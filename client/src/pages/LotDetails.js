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
    const [dateError, setDateError] = useState('');

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

    const handleSubmit = () => {
        if (selectedDate.trim() === '') {
            setDateError('Please select a date.');
            return;
        }
    
        // Clear any previous date error
        setDateError('');
    
        const selectedDateTime = new Date(selectedDate).getTime();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
        if (selectedDateTime < threeDaysLater.getTime()) {
            setDateError('Selected date must be at least 3 days from today.');
            return;
        }
    
        // Proceed with handling tour request...
        // Extract user ID from token
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const email = decodedToken.email;
    
        // Send tour request data to the server
        fetch('http://localhost:3001/submit-tour-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lot_Id: lotDetails.lot_Id,
                block_number: lotDetails.block_number,
                email,
                request_date: selectedDate
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Tour request submitted successfully:', data);
            // Handle success response if needed
        })
        .catch(error => {
            console.error('Error submitting tour request:', error);
            // Handle error if needed
        });
    };
    

    const handleRequestTour = () => {
        if (token) {
            handleSubmit();
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
                        <Card style={{ width: '69%', height: '500px', overflow: 'hidden' }}>
                            <Card.Img variant="top" src={lotDetails.image} alt={lotDetails.name} style={{ maxHeight: '500px', objectFit: 'cover' }} />
                        </Card>

                        {/* Additional Card */}
                        <Card style={{ width: '30%', height: '500px' }}>
                            <Card.Body>
                                <Card.Title style={{fontSize: '24px', marginBottom: '-8px'}}>Lot Details</Card.Title><br/>
                                <Card.Text style={{ margin: 0 }}>
                                    <p style={{ margin: 3, fontSize: '14px'}}>Price: <b>&#8369;{lotDetails.price.toLocaleString()}</b></p>
                                    <p style={{ margin: 3, fontSize: '14px'}}>Dimension: <b>{lotDetails.dimension} sqm.</b></p>
                                    <p style={{ margin: 3, fontSize: '14px'}}>Block #: <b>{lotDetails.block_number}</b> | Lot #: <b>{lotDetails.lot_number}</b></p><hr />
                                    <Card.Title style={{fontSize: '24px', marginBottom: '-8px'}}>Price Details</Card.Title><br/>
                                    <p style={{ margin: 3, fontSize: '14px'}}>Term: <b>{lotDetails.term} years.</b></p>
                                    <p style={{ margin: 3, fontSize: '14px'}}>Downpayment: <b>&#8369;{(lotDetails.price / 2).toLocaleString()}</b></p>
                                    <p style={{ margin: 3, fontSize: '14px'}}>Monthly: <b>&#8369;{((lotDetails.price / 2) / 24 ).toLocaleString()}</b></p><hr/>
                                </Card.Text>
                                <Card.Title style={{fontSize: '24px', marginTop: '10px'}}>Request a Tour</Card.Title>
                                <Form.Group>
                                    <Form.Label style={{marginTop: '10px', marginBottom: '-10px'}}>Select Date</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '14px', marginTop: '10px' }}
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className='mb-3'
                                    />
                                    {dateError && <Alert variant="danger">{dateError}</Alert>}
                                </Form.Group>
                                <Button variant="success" className='w-100' onClick={handleRequestTour}>Request</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ) : lotDetails ? (
                    <div>
                        {/* Lot Details Card */}
                        <Card style={{minheight: '540px'}}>
                            <Card.Img variant="top" src={lotDetails.image} alt={lotDetails.name} />
                            <Card.Body>
                                <Card.Title>{lotDetails.name}</Card.Title>
                                <Card.Text>
                                    <Card.Title style={{fontSize: '24px', marginBottom: '-8px', marginTop: '-20px'}}>Lot Details</Card.Title><br/>
                                    <p style={{ margin: 0, fontSize: '14px'}}>Price: &#8369;{lotDetails.price.toLocaleString()}</p>
                                    <p style={{ margin: 0, fontSize: '14px'}}>Dimension: {lotDetails.dimension} sqm.</p>
                                    <p style={{ margin: 0, fontSize: '14px'}}>Block | Lot: {lotDetails.block_number} | {lotDetails.lot_number}</p><hr/><br/>
                                    <Card.Title style={{fontSize: '24px', marginBottom: '-8px', marginTop: '-20px'}}>Price Details</Card.Title><br/>
                                    <p style={{ margin: 0, fontSize: '14px'}}>Term: <b>{lotDetails.term} years.</b></p>
                                    <p style={{ margin: 0, fontSize: '14px'}}>Downpayment: <b>&#8369;{(lotDetails.price / 2).toLocaleString()}</b></p>
                                    <p style={{ margin: 0, fontSize: '14px'}}>Monthly: <b>&#8369;{((lotDetails.price / 2) / 24 ).toLocaleString()}</b></p>
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        {/* Additional Card (Request a Tour) */}
                        <Card>
                            <Card.Body>
                                <Card.Title>Request a Tour</Card.Title>
                                <Form.Group>
                                    <Form.Label style={{ fontSize: '14px' }}>Select Date</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '14px'}}
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                    {dateError && <Alert variant="danger">{dateError}</Alert>}
                                </Form.Group>
                                <Button onClick={handleRequestTour} style={{marginTop: '10px', width: '100%'}} variant='success'>Request a Tour</Button>
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
