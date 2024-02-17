import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';

function LotDetailsPage() {
    const { lot_Id } = useParams();
    const [lotDetails, setLotDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);

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

    return (
        <div>
            {lotDetails && !isMobileView ? (
                <div className="d-flex justify-content-between">
                    {/* Lot Details Card */}
                    <Card style={{ width: '45%' }}>
                        <Card.Img variant="top" src={lotDetails.image} alt={lotDetails.name} />
                        <Card.Body>
                            <Card.Title>{lotDetails.name}</Card.Title>
                            <Card.Text>
                                <p>Description: {lotDetails.description}</p>
                                <p>Price: &#8369;{lotDetails.price.toLocaleString()}</p>
                                <p>Dimension: {lotDetails.dimension} sqm.</p>
                                <p>Block | Lot: {lotDetails.block_number} | {lotDetails.lot_number}</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    {/* Additional Card */}
                    <Card style={{ width: '45%' }}>
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
                            <Button variant="primary">Request a Tour</Button>
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
                                <p>Description: {lotDetails.description}</p>
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
                            <Button variant="primary">Request a Tour</Button>
                        </Card.Body>
                    </Card>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default LotDetailsPage;
