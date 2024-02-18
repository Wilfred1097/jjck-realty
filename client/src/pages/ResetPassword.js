import React, { useState } from 'react';
import { Container, Navbar, Card, Form, Button, Modal } from 'react-bootstrap';
import { resetPassword } from '../validation/LoginRegistration';
import { useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/check-user-exists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    birthdate,
                }),
            });
            const data = await response.json();

            if (data.exists) {
                // User already exists, handle it as per your requirement
                setShowPasswordModal(true);
                return;
            }

            // User does not exist, proceed to open the password modal
            alert('User did not exists');
        } catch (error) {
            console.error('Error checking user existence:', error);
            // Handle error if needed
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            await resetPassword.validate({ password, confirmPassword }, { abortEarly: false });

            // Passwords are valid, proceed with password submission logic

            // Call the reset-password API endpoint
            const response = await fetch('http://localhost:3001/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    newPassword: password, // Send the new password directly
                }),
            });

            if (response.ok) {
                console.log('Password reset successful');
                setShowPasswordModal(false); // Close the modal
                navigate('/login');
            } else if (response.status === 400) {
                alert('Please choose a new password.'); // Display an alert error if the response status is 400
            } else {
                console.error('Password reset failed:', response.statusText);
                // Handle other failure cases
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            // Handle error if needed
            setValidationError(error.message);
        }
    };

    const handleSubmitButtonClick = async (e) => {
        e.preventDefault(); // Prevent default form submission
        await handleSubmit(); // Call your submission logic
    };

    return (
        <>
            <Navbar bg="light" expand="lg" fixed="sticky-top">
                <Container fluid>
                    <Navbar.Brand href="/" className="p-1">JJCK REALTY SERVICES</Navbar.Brand>
                </Container>
            </Navbar>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                <Container>
                    <Container className="d-flex align-items-center justify-content-center">
                        <Card style={{ minWidth: '350px' }}>
                            <Card.Body>
                                <Card.Title>Reset Password</Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label style={{ fontSize: '14px' }}>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </Form.Group>
                                    {/*  */}
                                    <Form.Group controlId="formBasicBirthdate">
                                        <Form.Label style={{ fontSize: '14px' }}>Birthdate</Form.Label>
                                        <Form.Control type="date" placeholder="Enter birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
                                    </Form.Group>

                                    <Button variant="success" onClick={handleSubmitButtonClick} style={{ marginTop: '10px' }} className='w-100'>Submit</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Container>

                    {/* Password Modal */}
                    <Modal
                        show={showPasswordModal}
                        onHide={() => setShowPasswordModal(false)}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Enter New Password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label style={{ fontSize: '13px' }}>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ fontSize: '13px'}}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicConfirmPassword">
                                    <Form.Label style={{ fontSize: '13px' }}>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ fontSize: '13px'}}
                                        required
                                    />
                                    {validationError && <Form.Text className="text-danger">{validationError}</Form.Text>}
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                            <Button variant="success" onClick={handlePasswordSubmit}>Submit</Button>
                        </Modal.Footer>
                    </Modal>

                </Container>
            </div>
        </>
    );
}

export default ResetPasswordPage;
