const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors');
 const path = require('path');
const { exec } = require('child_process'); 
require('dotenv').config();
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));

const upload = multer({ dest: 'uploads/' });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3556',
    database: 'realeyes'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

/// const upload = multer({ dest: 'uploads/' });

app.post('/predict', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;

    
    const options = {
        scriptPath: 'C:\\Users\\HP\\Real_Eyes\\',
        args: [videoPath] 
    };

    PythonShell.run('deepfake_detection.py', options, (err, results) => {
        if (err) {
            console.error('Error running deepfake detection model:', err);
            return res.status(500).json({ message: 'Error processing video' });
        }
        try {
            const result = JSON.parse(results[0]);
            const isReal = !result.isDeepfake; 
            const accuracy = result.accuracy;

            // Clean up the uploaded video file
            fs.unlink(videoPath, err => {
                if (err) console.error('Error deleting uploaded file:', err);
            });

            res.json({ isReal, accuracy });
        } catch (parseError) {
            console.error('Error parsing Python script result:', parseError);
            res.status(500).json({ message: 'Error processing result' });
        }
        
    });
});


const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};


///const path = require('path');
///const fs = require('fs');
const { PythonShell } = require('python-shell');
/// const upload = require('multer')({ dest: 'uploads/' }); 



  
app.get('/result', (req, res) => {
    const isDeepfake = req.query.deepfake === 'true';
    res.sendFile(path.join(__dirname, '../public/html/result.html'));
    
});

app.post('/signup', async (req, res) => {
    const { full_name, email, password, confirm_password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [full_name, email, hashedPassword], (error, results) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (error, results) => {
        if (error) return res.status(500).json({ message: 'Internal server error' });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect('/upload');
    });
});

app.get('/profile', authenticateJWT, (req, res) => {
    const sql = 'SELECT full_name, email FROM users WHERE id = ?';
    db.query(sql, [req.user.id], (error, results) => {
        if (error) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(results[0]);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/homepage.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/Login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/signup.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/upload.html'));
});

app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/result.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));