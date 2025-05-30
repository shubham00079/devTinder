const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT token
      const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder790');

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

app.get('/profile', async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    if (!token) {
      throw new Error('Invalid credentials');
    }
    // validate my token
    const decodedMessage = await jwt.verify(token, 'DEV@Tinder790');
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error('USer does not exist');
    }
    res.send(user);
  } catch (error) {
    res.status(400).json({ message: 'invalid', error: error.message });
  }
});

app.get('/getUser', async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const users = await User.find({ emailId });
    if (users.length === 0) {
      res.status(400).send('User Not Found');
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send('Error getting data');
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(400).send('User Not Found');
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send('Error getting data');
  }
});

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId }); // both are same
    // const user = await User.findByIdAndDelete( userId );
    res.send('user deleted successfully');
  } catch (error) {
    res.status(400).send('Error getting data');
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ['about', 'gender', 'age', 'skillls'];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }

    if (data.skills.length > 10) {
      throw new Error('Skills cannot be more than 10');
    }

    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send('Updated successfully');
  } catch (error) {
    res.status(400).send(`Update failed: ${error.message}`);
  }
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
