const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');

// works for all routes and methods
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
  try {
    // Validation of the request body
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt tha password
    const passwordHash = await bcrypt.hash(password, 10);
    // creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('User added successfully');
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error saving the user', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error('Wrong email format');
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('User does not exist');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT token
      const token = await user.getJWT();

      // Add the token to cookie & send the response back to user
      res.cookie('token', token);
      res.send('User Logged in Successfully');
    } else {
      throw new Error('Invalid Credentials...');
    }
  } catch (error) {
    res.status(400).json({
      message: 'Failed',
      error: error.message,
    });
  }
});

// added a userAuth middleware
app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({ message: 'invalid', error: error.message });
  }
});

// securing APIs using userAuth
app.post('/sendConnectionRequest', userAuth, async (req, res) => {
  console.log('Sending a connection request');

  res.send('Connection request sent');
});


connectDB()
  .then(() => {
    console.log('Database connected...');
    app.listen(3000, () => {
      console.log('Server is successfully listening on port 3000....');
    });
  })
  .catch((err) => {
    console.log('Connection Not Made!!!');
  });
