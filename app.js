const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./models/user");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorRoutes = require("./controllers/error");
app.use((req, res, next) => {
  User.findOne()
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes.get404);

mongoose
  .connect("mongodb://localhost/shop", {
    useNewUrlParser: 1
  })
  .then(() => {
    User.findOne()
      .then(user => {
        if (!user) {
          user = new User({
            username: "Maverick",
            email: "maverick@test.com",
            cart: {
              items: []
            }
          });
          user.save();
        }
      })
      .catch(err => console.log(err));
    app.listen(3000);
  })
  .catch(err => console.log(err));
