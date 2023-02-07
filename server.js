const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");

const PORT = process.env.PORT || 8000;
app.use(express.static("public"));


//setting up template engine

app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
    res.render("home");
  });
  app.get("/cart", function (req, res) {
    res.render("customers/cart");
  });
  app.get("/login", function (req, res) {
    res.render("auth/login");
  });
  app.get("/register", function (req, res) {
    res.render("auth/register");
  });

app.listen(PORT, function (err) {
  if (err) {
    console.log("Falied to connect to server");
    return;
  }
  console.log("Server is running at PORT no.", PORT);
});
