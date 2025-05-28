const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

// works for all routes and methods
app.use(express.json());

app.post("/signup", async (req,res) => {
    // creating a new instance of the user model
    const user = new User(req.body);
    try {
        await user.save();
        res.send('User added successfully');
    } catch (error) {
        res.status(400).send("Error saving the user", error.message);
    }
})

app.get('/getUser', async (req,res) => {
  const emailId = req.body.emailId
  try {
      const users = await User.find({ emailId });
      if(users.length === 0){
        res.status(400).send("User Not Found");
      } else {
        res.send(users);
      }
  } catch (error) {
    res.status(400).send("Error getting data");
  }
})

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({  });
    if (users.length === 0) {
      res.status(400).send('User Not Found');
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send('Error getting data');
  }
});

app.delete('/user', async (req,res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId }); // both are same
    // const user = await User.findByIdAndDelete( userId );
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400).send('Error getting data');
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



