const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); 

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/src', express.static(path.resolve(__dirname, '../../src')));


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../index.html'));
});


app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../index.html'));
});


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGO_DB_NAME 
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});


const User = mongoose.model('User', UserSchema, process.env.MONGO_COLLECTION_NAME);

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(400).json({ error: 'Signup failed' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
});

app.listen(5000, () => console.log('Server running on port 5000'));
