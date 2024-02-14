const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
// https://jjck-realty-services-client.onrender.com/

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


const PORT = process.env.PORT;

app.use(bodyParser.json());

// Create a MySQL connection pool
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.PORT,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jjck',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.post('/register', async (req, res) => {
  try {
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    const insertUserQuery = "INSERT INTO users (`complete_name`, `birthdate`, `address`, `email`, `password`) VALUES (?)";

    // Check if the email already exists
    const [emailResults] = await db.query(checkEmailQuery, [req.body.email]);

    if (emailResults.length > 0) {
      return res.json({ Status: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(req.body.password.toString(), bcryptjs.genSaltSync(10));

    const values = [
      req.body.completename,
      req.body.birthdate,
      req.body.address,
      req.body.email,
      hashedPassword,
    ];

    // Insert the user into the database
    await db.query(insertUserQuery, [values]);

    return res.status(200).json({ status: "Success" });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ status: "Internal Server Error", message: "An unexpected error occurred. Please try again." });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const getUserQuery = 'SELECT * FROM users WHERE email = ?';
    const [userResults] = await db.query(getUserQuery, [email]);

    if (userResults.length === 0) {
      return res.json({ status: 'InvalidCredentials', message: 'Invalid email or password.' });
    }

    const hashedPassword = userResults[0].password;
    const passwordMatch = await bcryptjs.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.json({ status: 'InvalidCredentials', message: 'Invalid email or password.' });
    }

    // User authentication is successful; generate a JWT token
    const user = {
      id: userResults[0].id,
      email: userResults[0].email,
      // Add more user properties as needed
    };

    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });

    // You may include more user data in the response if needed
    return res.json({ status: 'Success', message: 'Login successful.', token });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});

// Add this endpoint to retrieve all users
app.get('/users', async (req, res) => {
  try {
    const getAllUsersQuery = 'SELECT * FROM users';
    const [usersResults] = await db.query(getAllUsersQuery);

    return res.status(200).json({ status: 'Success', users: usersResults });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});

// Add this endpoint in your backend server
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Implement logic to generate a unique token for password reset
    const resetToken = generateUniqueToken();

    // Store the reset token in your database along with the user's email and an expiration time

    // Send an email with a link containing the reset token to the user's email address
    await sendResetPasswordEmail(email, resetToken);

    return res.status(200).json({ status: 'Success', message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});

// Add this endpoint in your backend server
app.post('/reset-password', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    // Implement logic to verify the reset token and update the user's password in the database

    return res.status(200).json({ status: 'Success', message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error in reset password:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});

// Add this endpoint to check if the email is present in the database
app.post('/check-email-exists', async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';

    // Check if the email already exists
    const [emailResults] = await db.query(checkEmailQuery, [email]);

    if (emailResults.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});


app.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: 'Success' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/lots', async (req, res) => {
  try {
    const getAllLotsQuery = 'SELECT * FROM lot_table';
    const [lotsResults] = await db.query(getAllLotsQuery);

    return res.status(200).json({ status: 'Success', lots: lotsResults });
  } catch (error) {
    console.error('Error retrieving lots:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});
