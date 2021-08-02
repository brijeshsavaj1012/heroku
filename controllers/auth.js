const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult, Result } = require("express-validator");

const User = require("../models/user");
const Abc = require("../models/abc");
exports.sign = (req,res,next)=>{
  const name = req.body.name;
  const abc = new Abc({
    name: name
  });
  res.send("save");
  return abc.save();
 
}

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation faild");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedpw) => {
      const user = new User({
        email: email,
        password: hashedpw,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong Password!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      } , 'somesupersecret' , {expiresIn : '1h'});
      res.status(200).json({token: token , userId: loadedUser._id.toString()});
    })
    .catch((err) => {
      if (!statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
