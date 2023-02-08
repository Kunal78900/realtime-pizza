require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");

const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);

// database connection
const url = "mongodb+srv://KUNAL:KUNAL9900@mernapp.oaibt56.mongodb.net/pizza";
mongoose.connect(url);
const connection = mongoose.connection;
connection.once("open", (err) => {
  if (err) {
    console.log("Error in connecting to the db..");
  }
  console.log("Database Connected Successfully..");
});
//session store

let mongoStore = new MongoDbStore({
  mongooseConnection:connection,
  collection:'sessions'
})

//session config

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store:mongoStore,
    saveUninitialized: false,

    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
  })
);

app.use(flash());

//assets
app.use(express.static("public"));
app.use(express.json())
//middleware

app.use((req,res,next)=>{
   res.locals.session = req.session
   next()
})

//setting up template engine

app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);
app.listen(PORT, function (err) {
  if (err) {
    console.log("Falied to connect to server");
    return;
  }
  console.log("Server is running at PORT no.", PORT);
});
