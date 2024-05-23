const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb://localhost:27017/techalphaHub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.render('thankyou', { name });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        req.session.user = user;
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('home', { name: req.session.user.name });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
