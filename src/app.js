'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const $ = require('jQuery');
const mongoose = require('mongoose');
const User = require('../models/user.js');
const UserOccupation = require('../models/user.js').occupation;
const session = require('express-session');
const mid = require('../middleware');
const MongoStore = require('connect-mongo')(session);
const nodemailer = require('nodemailer');
const router = express.Router();

//conection to mongodb
mongoose.connect("mongodb://localhost:27017/occupation");
const db = mongoose.connection;
//mongo error
db.on('error', console.error.bind(console, "conection error:"));


//use sessions for tracking logins
app.use(session({
  secret: 'occupation-site',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(__dirname + '/public'))

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', (req, res, next) => {
  res.render('login', {title: 'Login'});
});

//GET sign out
app.get('/signout', function(req, res, next) {
  if (req.session) {
    //Delete session
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//POST route
app.post('/', mid.loggedOut, (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong eamil or password');
        err.status = 401;
        return next(err);
      } else {
        var logInUpdate = {
          logInTime: Date.now()
        }
        req.session.userId = user._id;
        User.findById(req.session.userId).update(logInUpdate, function (err, user) {
          if (err) {
            return next(err);
          }
        });
        return res.redirect('/home');
      }
    });
  } else {
    var err = new Error('Email and password are required');
    err.status = 401;
    return next(err);
  }
});

app.get('/register', mid.loggedOut, (req, res) => {
  res.render('register', {title: 'Register'})
});

app.post('/register', (req, res, next) => {
  if (req.body.name &&
    req.body.email &&
    req.body.occupation &&
    req.body.password) {

      var userData = {
        name: req.body.name,
        email: req.body.email,
        occupation: req.body.occupation,
        password: req.body.password,
        logInTime: Date.now()
      };

      User.create(userData, function (err, user) {
        if (err) {
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/home');
        }
      });

    } else {
      const err = new Error('All fields required');
      err.status = 400;
      return next(err);
    }
});

app.get('/home', mid.requiresLogin,(req, res, next) => {

  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('home', {title: 'Home', name: user.name, occupation: user.occupation, email: user.email})
      }
    });


});

app.get('/lastonline', mid.requiresLogin, (req, res, next) => {

  User.find({}, {_id: 0, name: 1, email: 1, occupation: 1, logInTime: 1}, {sort: {logInTime: -1}}, function (err, User) {
    if(err) {
      return next(err)
    } else {
      res.json(User);
    };
  });
});

app.get('/search', mid.requiresLogin, (req, res, next) => {
  User.find({occupation: req.query.occupation}, {_id: 0, name: 1, email: 1, occupation: 1, logInTime: 1}, {sort: {logInTime: -1}}, function (err, User) {
    if(err) {
      return next(err)
    } else {
      res.json(User);
    };
  });
  console.log(req.query.occupation);
});



app.get('/edit', mid.requiresLogin, (req, res) => {

  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('edit', {title: 'Edit', name: user.name, occupation: user.occupation, email: user.email})
      }
    });

});

app.post('/editUpdate', (req, res, next) => {

  if (req.body.name ) {

    var userDataName = {
        name: req.body.name,
      };

    User.findById(req.session.userId).update(userDataName, function (err, user) {
      if (err) {
        return next(err);
      }
    });

  };

  if (req.body.occupation ) {

    var userDataOccupation = {
        occupation: req.body.occupation,
      };

    User.findById(req.session.userId).update(userDataOccupation, function (err, user) {
      if (err) {
        return next(err);
      }
    });

  };

  if (req.body.email ) {

    var userDataEmail = {
        email: req.body.eamil,
      };

    User.findById(req.session.userId).update(userDataEmail, function (err, user) {
      if (err) {
        return next(err);
      }
    });

  };
  if (req.body.name || req.body.occupation || req.body.email){
    return res.redirect('/home');
  } else {
      const err = new Error('All fields required');
      err.status = 400;
      return next(err);
    }
});

app.get('/contact', (req, res) => {
  res.render('contact', {title: 'Contact'})
});

app.get('/mailsent', (req, res) => {
  res.render('mailsent', {title: 'Contact'})
});

app.use('/sayHello', router);
router.post('/', handleSayHello);

function handleSayHello(req, res) {
  // Not the movie transporter!
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'jkminer1.jk@gmail.com', // Your email id
          pass: 'R00st3rt33th1' // Your password
      }
  });
  var text = 'Hello world from \n\n' + req.body.name;

  var mailOptions = {
    from: req.body.email, // sender address
    to: 'kortbeekdesigns@gmail.com',  // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.name + '\n' + req.body.email + '\n' + req.body.message, // plaintext body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
  });
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, () => {
    console.log("running on port 3000");
});
