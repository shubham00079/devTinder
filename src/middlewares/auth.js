const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    // read the token from req.cookies
    const { token } = req.cookies;
    console.log(token);
    if (!token) {
      throw new Error('Token is not valid!!!');
    }

    // validate the token
    const decodedObj = await jwt.verify(token, 'DEV@Tinder790');
    const { _id } = decodedObj;

    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not Found');
    }

    // adding user data to req object
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error.message });
  }
};

module.exports = {
  userAuth,
};
