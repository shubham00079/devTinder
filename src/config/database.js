const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
      'mongodb+srv://rockingshubh07:04PD05JtCM18yIFs@cluster0.c1t64k4.mongodb.net/devTinder'
    );
}

module.exports = connectDB;