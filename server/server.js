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
      id: userResults[0].userId,
      name: userResults[0].complete_name,
      birthdate: userResults[0].birthdate,
      address: userResults[0].address,
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

app.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Query the database to get the current hashed password
    const getPasswordQuery = 'SELECT password FROM users WHERE email = ?';
    const [rows] = await db.query(getPasswordQuery, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ status: 'Error', message: 'User not found.' });
    }

    const hashedPassword = rows[0].password;

    // Compare the new password with the current hashed password
    const passwordMatch = await bcryptjs.compare(newPassword, hashedPassword);

    if (passwordMatch) {
      // If the new password matches the current hashed password, return an error
      return res.status(400).json({ status: 'Error', message: 'Please choose a new password.' });
    }

    // Hash the new password using bcryptjs with salt 10
    const newHashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the password in the users table
    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
    await db.query(updateQuery, [newHashedPassword, email]);

    console.log('Password updated successfully');

    return res.status(200).json({ status: 'Success', message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error in reset password:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});


// Add this endpoint to check if the email is present in the database
app.post('/check-user-exists', async (req, res) => {
  try {
    const { email, birthdate } = req.body;
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? AND birthdate = ?';

    // Check if the user already exists
    const [userResults] = await db.query(checkUserQuery, [email, birthdate]);

    if (userResults.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
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

// Add this endpoint to fetch data from lot_table based on lot_Id
app.get('/lots/:lot_Id', async (req, res) => {
  try {
    const lotId = req.params.lot_Id;
    const getLotByIdQuery = 'SELECT * FROM lot_table WHERE lot_Id = ?';
    const [lotResult] = await db.query(getLotByIdQuery, [lotId]);

    if (lotResult.length === 0) {
      return res.status(404).json({ status: 'NotFound', message: 'Lot not found.' });
    }

    return res.status(200).json({ status: 'Success', lot: lotResult[0] });
  } catch (error) {
    console.error('Error retrieving lot by ID:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});

app.post('/submit-tour-request', async (req, res) => {
  try {
    const { lot_Id, block_number, email, request_date } = req.body;

    // Insert the tour request into the tour_request_table with status as 'pending'
    const insertTourRequestQuery = 'INSERT INTO tour_request_table (lot_Id, block_number, email, request_date, status) VALUES (?, ?, ?, ?, ?)';
    await db.query(insertTourRequestQuery, [lot_Id, block_number, email, request_date, 'pending']);

    return res.status(200).json({ status: 'Success', message: 'Tour request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting tour request:', error);
    return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});

app.post('/tour-request', async (req, res) => {
  try {
      // Extract the name parameter from the request body
      const { name } = req.body;

      // Construct the query with a WHERE clause to filter by name
      const getAllLotsQuery = `SELECT * FROM tour_request_vew WHERE user_name = ?`;
      const [lotsResults] = await db.query(getAllLotsQuery, [name]);

      return res.status(200).json({ status: 'Success', lots: lotsResults });
  } catch (error) {
      console.error('Error retrieving lots:', error);
      return res.status(500).json({ status: 'ServerError', message: 'An unexpected error occurred. Please try again.' });
  }
});