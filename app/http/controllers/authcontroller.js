const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authcontroller() {
  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, () => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect("/");
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;
      //validation
      if (!name || !email || !password) {
        req.flash("error", "all fields are required!!");
        req.flash("name", name);
        req.flash("email", email);

        return res.redirect("/register");
      }
      //check if email exists
      User.exists(
        {
          email: email,
        },
        (err, result) => {
          if (result) {
            req.flash("error", "Email already exists!!");
            req.flash("name", name);
            req.flash("email", email);
            return res.redirect("/register");
          }
        }
      );
      //Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);
      //create the user
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      user
        .save()
        .then((user) => {
          //Login

          return res.redirect("/");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong!!");
          // return res.redirect("/");
        });
      console.log(req.body);
    },
    logout(req, res) {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/login");
      });
    },
  };
}

module.exports = authcontroller;
