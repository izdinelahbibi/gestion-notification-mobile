require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key'; // Replace with a secure key in production

// Middleware
app.use(cors());  // Accepte toutes les origines pour les tests; en production, spécifiez l'origine
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'user_database'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
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
// Route to fetch annonces
app.get('/api/annonces', (req, res) => {
  db.query('SELECT * FROM annonces ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching annonces:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.get('/classes', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM classes');
    res.status(200).json({ classes: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});



app.post('/register', async (req, res) => {
  console.log('Données reçues :', req.body);
  const { username, email, password, class: userClass } = req.body;

  if (!username || !email || !password || !userClass) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Cet e-mail est déjà utilisé.' });
    }

    // Récupérer l'ID de la classe
    const [classRows] = await db.promise().query('SELECT id_classe FROM classes WHERE nom_classe = ?', [userClass]);
    if (classRows.length === 0) {
      return res.status(400).json({ error: 'Classe invalide.' });
    }
    const classeId = classRows[0].id_classe;

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    await db.promise().query(
      'INSERT INTO users (nom, email, role, classe_id, password) VALUES (?, ?, ?, ?, ?)',
      [username, email, 'etudiant', classeId, hashedPassword]
    );

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// Route de connexion
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Générer le token avec les informations de l'utilisateur
    const token = jwt.sign(
      {
        id_user: user.id_user,     // Identifiant utilisateur
        nom: user.nom,             // Nom de l'utilisateur
        email: user.email,         // Email de l'utilisateur
        role: user.role,           // Rôle de l'utilisateur (admin/étudiant)
        classe_id: user.classe_id, // Identifiant de la classe (si applicable)
        password: user.password    // Mot de passe de l'utilisateur (pas une bonne pratique mais ici pour respecter la demande)
      },
      JWT_SECRET, // Utilisez la clé secrète pour signer le token
      { expiresIn: '1h' } // Durée de validité du token
    );

    // Répondre avec le token
    res.json({
      success: true,
      message: 'Login successful',
      token
    });
  });
});

// Route pour récupérer les notes depuis la base de données
app.get('/api/notes', (req, res) => {
  const query = 
  ' SELECT notes.id, notes.note, notes.subject, notes.assessment_type, users.username FROM notes JOIN users ON notes.user_id = users.id;'
  // Remplacez par votre table de notes
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Erreur de récupération des notes');
    }
    res.json(results);
  });
});

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupère le token du header Authorization

  if (!token) {
    return res.status(403).json({ message: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Vérifie et décode le token
    req.user = { id: decoded.id_user }; // Ajoute l'ID de l'utilisateur à la requête
    next(); // Passe à la route suivante
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' }); // Si le token est invalide ou expiré
  }
};

// Route pour récupérer le profil de l'utilisateur
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extraire le token Bearer

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    // Si le token est valide, récupérer les informations de l'utilisateur depuis la base de données
    const userId = decoded.id_user;

    db.query('SELECT * FROM users WHERE id_user = ?', [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération du profil utilisateur' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      const user = results[0];
      // Répondre avec les informations de l'utilisateur
      res.json({
        id_user: user.id_user,
        nom: user.nom,
        email: user.email,
        role: user.role,
        classe_id: user.classe_id,
      });
    });
  });
});


// Route pour mettre à jour le profil de l'utilisateur
app.put('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extraire le token Bearer

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    // Si le token est valide, récupérer l'ID de l'utilisateur
    const userId = decoded.id_user;

    // Extraire les données de mise à jour du corps de la requête
    const { nom, email, role, className, password } = req.body;

    // Vérifier que les champs obligatoires sont présents
    if (!nom || !email || !role || !className) {
      return res.status(400).json({ error: 'Tous les champs sont requis (nom, email, role, className).' });
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'L\'email n\'est pas valide.' });
    }

    // Vérification de la validité du rôle
    const validRoles = ['admin', 'etudiant'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Le rôle doit être soit "admin" soit "etudiant".' });
    }

    // Préparer la requête de mise à jour
    let updateQuery = 'UPDATE users SET nom = ?, email = ?, role = ?, classe_id = ?';
    const params = [nom, email, role, className];

    // Si un mot de passe est fourni, le hacher et l'ajouter à la requête
    if (password) {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe.' });
        }

        // Ajouter le mot de passe haché à la requête
        updateQuery += ', password = ?';
        params.push(hashedPassword);

        // Ajouter la condition WHERE pour l'utilisateur actuel
        updateQuery += ' WHERE id_user = ?';
        params.push(userId);

        // Exécution de la requête de mise à jour
        db.query(updateQuery, params, (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour des données utilisateur' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
          }

          // Répondre avec un message de succès
          res.json({ message: 'Profil mis à jour avec succès' });
        });
      });
    } else {
      // Si aucun mot de passe n'est fourni, effectuer la mise à jour sans le mot de passe
      updateQuery += ' WHERE id_user = ?';
      params.push(userId);

      // Exécution de la requête de mise à jour
      db.query(updateQuery, params, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de la mise à jour des données utilisateur' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Utilisateur introuvable' });
        }

        // Répondre avec un message de succès
        res.json({ message: 'Profil mis à jour avec succès' });
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur ${PORT}`);
});
