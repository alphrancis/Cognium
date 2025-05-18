const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const path = require('path');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/src', express.static(path.resolve(__dirname, '../../src')));


mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME
});

mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', UserSchema, process.env.MONGO_COLLECTION_NAME);


app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

        res.status(201).json({ message: 'User created', token });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Signup failed' });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

        res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Login failed' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../index.html'));
});

app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));