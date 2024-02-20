import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import TopBarNavigation from './topbar';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function MyAccount() {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userBirthdate, setUserBirthdate] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [tourRequestData, setTourRequestData] = useState([]);
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 1;

    useEffect(() => {
        decodeToken(token);
    }, [token]);

    const decodeToken = (token) => {
        if (!token) return;

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const { email, name, birthdate, address } = decodedToken;

        if (email) setUserEmail(email);
        if (name) setUserName(name);
        if (birthdate) setUserBirthdate(birthdate);
        if (address) setUserAddress(address);
    };

    const fetchTourRequest = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3001/tour-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: userName })
            });
            const data = await response.json();

            if (response.status === 200 && data.status === 'Success') {
                if (data.message && data.message === 'No available Tour Request') {
                    setTourRequestData([]); // Set empty array as there are no tour requests
                } else {
                    setTourRequestData(data.lots);
                }
            } else {
                console.error('Error fetching tour request:', data.message || response.statusText);
            }
        } catch (error) {
            console.error('Error fetching tour request:', error);
        }
    }, [userName]);

    useEffect(() => {
        if (userName) {
            fetchTourRequest();
        }
    }, [userName, fetchTourRequest]);

    const handleNextClick = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevClick = () => {
        setCurrentPage(currentPage - 1);
    };

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = tourRequestData.slice(indexOfFirstRequest, indexOfLastRequest);

    const totalPages = Math.ceil(tourRequestData.length / requestsPerPage);

    return (
        <>
            <TopBarNavigation />
            <Row className="m-1">
                <Col sm={4} xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title className='mb-3' style={{marginBottom: '100px'}}>Information</Card.Title>
                            <Card.Text style={{ fontSize: '14px'}}>
                                {/* <p style={{ margin: 3 }}><strong>ID: </strong>{userId}</p> */}
                                <p style={{ margin: 3 }}><strong>Name: </strong>{userName}</p>
                                <p style={{ margin: 3 }}><strong>Email: </strong>{userEmail}</p>
                                <p style={{ margin: 3 }}><strong>Birthdate: </strong>{userBirthdate}</p>
                                <p style={{ margin: 3 }}><strong>Address: </strong>{userAddress}</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4} xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title className='mb-3'>Tour Request</Card.Title>
                            {tourRequestData.length === 0 ? (
                                <p>No available Tour Request</p>
                            ) : (
                                currentRequests.map((request, index) => (
                                    <div key={index}>
                                        <Card.Text style={{ fontSize: '14px' }}>
                                            <p style={{ margin: 3 }}><strong>Lot #:</strong> {request.lot_Id}</p>
                                            <p style={{ margin: 3 }}><strong>Block #:</strong> {request.block_number}</p>
                                            <p style={{ margin: 3 }}><strong>Status:</strong> {request.status}</p>
                                            <p style={{ margin: 3 }}><strong>Request Date:</strong> {request.request_date}</p>
                                            <p style={{ margin: 3 }}><strong>Date Requested:</strong> {new Date(request.request_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
                                        </Card.Text>
                                    </div>
                                ))
                            )}
                            <div className="d-flex justify-content-between mt-3">
                                <Button variant="success" onClick={handlePrevClick} disabled={currentPage === 1}>
                                    <FaAngleLeft />
                                </Button>
                                <Button variant="success" onClick={handleNextClick} disabled={currentPage === totalPages}>
                                    <FaAngleRight />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4} xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title className='mb-2'>My Bills</Card.Title>
                            {/* Add content for My Bills here */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default MyAccount;
