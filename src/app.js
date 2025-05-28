const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post("/signup", async (req,res) => {
    const userObj = {
        firstName : "Shubham",
        lastName: "Kashyap",
        emailId: "xxx@gmail.com",
        password: "qwerty"
    }

    // creating a new instance of the user model
    const user = new User(userObj);

    try {
        await user.save();
        res.send('User added successfully');
    } catch (error) {
        res.status(400).send("Error saving the user", error.message);
    }
})


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



