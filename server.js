const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require("connect-mongo");

const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require("./controllers/users");

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const userRoutes = require("./controllers/users");

const port = process.env.PORT ? process.env.PORT : '3000';


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

// SESSION MANAGEMENT 

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passUserToView);
app.use("/users", userRoutes);
app.use("/users", usersController);

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});


// users must be signed in to view any of the routes associated with their pantry. Therefore, isSignedIn should come above the foods controller, but not before auth.

// app.use(passUserToView); 
app.use('/auth', authController);
app.use(isSignedIn);  // First check if user is signed in
app.use('/users', foodsController);  // Then allow access to foods routes if they are



console.log("🔹 Foods controller loaded!");

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
