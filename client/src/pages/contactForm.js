import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
const mailgun = require("mailgun-js");

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const DOMAIN = "sandbox9bf8be9f618e4e7b970d71378aa5ce32.mailgun.org";
    const mg = mailgun({ apiKey: "<PRIVATE_API_KEY>", domain: DOMAIN });
    const data = {
      from: `Mailgun Sandbox <postmaster@${DOMAIN}>`,
      to: "catalanwilfredo97@gmail.com",
      subject: "Contact Form Submission",
      text: `
        Name: ${formData.name}
        Email: ${formData.email}
        Message: ${formData.message}
      `
    };

    try {
      await mg.messages().send(data);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message. Please try again later.');
    }
  };

  return (
    <Form className="border rounded shadow p-3 p-md-4 p-lg-5" method="post" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)' }} onSubmit={handleSubmit}>
      <h2 className="text-center mb-3" style={{ color: 'black'}}>Contact us</h2>
      <Form.Group className="mb-3">
        <Form.Control type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control as="textarea" name="message" placeholder="Message" rows="6" value={formData.message} onChange={handleChange} required />
      </Form.Group>
      <div className="mb-3">
        <Button variant="primary" type="submit">
          Send
        </Button>
      </div>
    </Form>
  );
};

export default ContactForm;