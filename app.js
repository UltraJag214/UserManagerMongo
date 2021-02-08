const express = require('express');
const app = express()
const port = 3000;
const mongoose = require('mongoose');

const dbConnectionString = "mongodb://localhost/UserManager";
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: { type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/createNewUser', async (req, res) => {
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age,
    });
    newUser.save().then(() => console.log("Success"));
    res.redirect('/user')
});

app.get('/user', (req, res) => {
    User
        .find({}, function (err, something) {
            res.render('user', { whatever: something });
        });
});

app.get('/asc', (req, res) => {
    User.find({}).sort('firstName').exec(function (err, docs) {
        res.render('user', { whatever: docs });
    });
});

app.get('/dsc', (req, res) => {
    User.find({}).sort('-firstName').exec(function (err, docs) {
        res.render('user', { whatever: docs });
    });
});

app.get('/edit/:namedit', (req, res) => {
    User
        .find({ _id: req.params.namedit }, function (err, something) {
            res.render('edit', { myObj: something[0] });
        });
});

app.post('/edit/:userID', (req, res) => {
    User.updateOne({ _id: req.params.userID }, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age
    }, function (err, res) {
        console.log('Success');
    });
    res.redirect('/user');
});

app.get('/deleteUser/:userID', (req, res) => {
    User.deleteOne({ _id: req.params.userID }, function (err, res) {
        console.log('Success');
    });
    res.redirect('/user');
});

app.get('/search', (req, res) => {
    res.render('search');
});

app.post('/searchPage', (req, res) => {

    if (req.body.firstName && !req.body.lastName) {
        User
            .find({ firstName: req.body.firstName }, function (err, something) {
                res.render('user', { whatever: something });
            });
    } else if (req.body.lastName && !req.body.firstName) {
        User
            .find({ lastName: req.body.lastName }, function (err, something) {
                res.render('user', { whatever: something });
            });
    } else {
        User
            .find({ firstName: req.body.firstName, lastName: req.body.lastName }, function (err, something) {
                res.render('user', { whatever: something });
            });
    }
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});