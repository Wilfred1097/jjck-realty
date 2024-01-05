import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button, Carousel } from 'react-bootstrap';
import Iframe from 'react-iframe';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  
  const getRandomImage = () => {
    // Replace these placeholder URLs with actual image URLs or use an API to fetch images.
    const imageUrls = [
      'https://t4.ftcdn.net/jpg/01/15/23/79/240_F_115237993_GYjbk7VST3MJkRGR09fUYPDQBXZr6rXD.jpg',
      'https://t4.ftcdn.net/jpg/01/15/23/79/240_F_115237993_GYjbk7VST3MJkRGR09fUYPDQBXZr6rXD.jpg',
    ];

    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const listings = [
    { title: 'Listing 1', description: 'Description for Listing 1' },
    { title: 'Listing 2', description: 'Description for Listing 2' },
    { title: 'Listing 3', description: 'Description for Listing 3' },
    { title: 'Listing 4', description: 'Description for Listing 4' },
    { title: 'Listing 5', description: 'Description for Listing 5' },
    { title: 'Listing 6', description: 'Description for Listing 6' },
    { title: 'Listing 7', description: 'Description for Listing 7' },
    { title: 'Listing 8', description: 'Description for Listing 8' },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.Status === 'Success') {
          console.log('Logout Successfully');
          
          // Clear the token from localStorage
          localStorage.removeItem('token');
          
          navigate('/');
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };
  


  return (
    <>
    {/* Start of navbar */}
      <Navbar bg="light" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="#" className='m-1'>JJCK REALTY SERVICES</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="mx-auto m-1">
            <Nav.Link href="#listing">Listings</Nav.Link>
            <Nav.Link href="#contact">Contact Us</Nav.Link>
          </Nav>
          <Form className="d-flex justify-content-end">
            <FormControl className='m-1' type="search" placeholder="Search" aria-label="Search" />
            <Button className='m-1' variant="success" type="submit">Search</Button>
            <Button className='m-1' variant="primary" onClick={handleLogout}>Logout</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {/* End of navbar */}

    {/* Start of Carousel */}
    <Carousel activeIndex={index} onSelect={handleSelect}>
        {[1, 2, 3].map((idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100 img-fluid"
              src={getRandomImage() }
              alt={`Slide ${idx}`}
              style={{ maxHeight: '950px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Image {idx}</h3>
              <p>Some description for Image {idx}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      {/* End of Carousel */}
      
      {/* Start of Listing */}
      <Container className="mt-5" id='listing'fluid>
        <Row>
          <Col className='text-center mb-4'>
            <h2>Listings</h2>
            <p>This are the new listed lot.</p>
          </Col>
        </Row>
        <Row>
        {listings.map((listing, index) => (
          <Col key={index} xxl={3} xl={4} md={6} sm={12} xs={12} className="mb-4">
            <div className="listing-item">
              <div>
                <img
                  src='https://t4.ftcdn.net/jpg/00/86/79/15/240_F_86791518_rQZ4pYogBmAIzzOUj4un1oSAThBcMjL4.jpg'
                  alt={`Listing ${index + 1}`}
                  className="img-fluid"
                  style={{ height: '250px', width: '100%' }}
                />
              </div>
              <div className="listing-details">
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
              </div>
            </div>
          </Col>
        ))}
        </Row>
        <Row>
          <Col className='text-center'>
            <p style={{ textDecoration: 'none' }}><h4>More Listings</h4></p>
          </Col>
        </Row>
      </Container>
      {/* End of Listing */}

      {/* Start of Contact us */}
      <section id="contact" className="position-relative py-5">
      <div className="d-md-none">
        <Iframe
          url="https://cdn.bootstrapstudio.io/placeholders/map.html"
          width="100%"
          height="100%"
          title="Map"
          allowFullScreen
        />
      </div>
      <div className="d-none d-md-block position-absolute top-0 start-0 w-100 h-100">
        <Iframe
          url="https://cdn.bootstrapstudio.io/placeholders/map.html"
          width="100%"
          height="100%"
          title="Map"
          allowFullScreen
        />
      </div>
      <div className="position-relative mx-2 my-5 m-md-5">
        <Container>
          <Row>
            <Col md={6} xl={5} xxl={4} className="offset-md-6 offset-xl-7 offset-xxl-8">
              <div>
                <Form className="border rounded shadow p-3 p-md-4 p-lg-5" method="post" style={{ background: 'var(--bs-body-bg)' }}>
                  <h3 className="text-center mb-3">Contact us</h3>
                  <Form.Group className="mb-3">
                    <Form.Control type="text" name="name" placeholder="Name" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control type="email" name="email" placeholder="Email" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control as="textarea" name="message" placeholder="Message" rows="6" />
                  </Form.Group>
                  <div className="mb-3">
                    <Button variant="primary" type="submit">
                      Send
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
    {/* End of Contact us */}

    <footer className="text-center py-4">
      <Container>
        <Row className="row-cols-1 row-cols-lg-3 row-cols-lg-4">
          <Col>
            <div className="d-flex align-items-center p-3">
              <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon">
                <svg className="bi bi-telephone" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"></path>
                </svg>
              </div>
              <div className="px-2">
                <h6 className="text-start d-xxl-flex justify-content-xxl-start mb-0">Phone</h6>
                <p className="mb-0">+123456789</p>
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex align-items-center p-3">
              <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon">
                <svg className="bi bi-envelope" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"></path>
                </svg>
              </div>
              <div className="px-2">
                <h6 className="text-start d-xxl-flex justify-content-xxl-start mb-0">Email</h6>
                <p className="mb-0">info@example.com</p>
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex align-items-center p-3">
              <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon">
                <svg className="bi bi-pin" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408-.002-.001.002.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z"></path>
                </svg>
              </div>
              <div className="px-2">
                <h6 className="text-start d-xxl-flex justify-content-xxl-start mb-0">Location</h6>
                <p className="mb-0">12 Example Street</p>
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex align-items-center p-3">
              <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon">
                <svg className="bi bi-facebook" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                </svg>
              </div>
              <div className="px-2">
                <h6 className="text-start d-xxl-flex justify-content-xxl-start mb-0">Facebook</h6>
                <p className="mb-0">JJCK Realty Services</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>

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
  );
}

export default Homepage