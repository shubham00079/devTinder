const express = require('express');

// creating new instance of express application
const app = express();


app.use((req,res, next) => {
    console.log('Middleware called');
    next();
});

app.get('/user', (req,res) => {
    console.log('/user request called');
    res.send("User");

})

app.listen(3000, () => {
    console.log("Server is successfully listening on port fd dss 3000....")
});
// port for listensing incoming requests


