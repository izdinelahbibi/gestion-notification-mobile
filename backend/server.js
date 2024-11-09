require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key'; // Replace with a secure key in production

// Middleware
app.use(cors());  // Allows all origins for testing; specify origin in production
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'user_database'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Route pour récupérer les fichiers téléchargés
app.get('/api/courses', (req, res) => {
  const query = 'SELECT * FROM uploaded_files ORDER BY uploaded_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers.' });
    }
    res.json(results);
  });
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (error) => {
          if (error) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, message: 'Login successful', token });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
