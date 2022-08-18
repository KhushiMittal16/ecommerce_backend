const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.signup = (req, res) => {
  // console.log("req.body",req.body)
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    User.salt = undefined;
    User.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  //find user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    {
      if (err || !user) {
        return res.status(400).json({
          err: "User with this email don't exist. If you don't have an account please Sign up!!!",
        });
      }
      //if user is found with correct email and password
      //create authenticate method in user model method
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: `Email and password don't match`,
        });
      }
      //generate a signed token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      //persist the token as 't' in cookie with expiry date
      res.cookie("t", token, { expire: new Date() + 9999 });
      //return response with user and token to frontend client
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, name, email, role } });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Successfully signed out." });
};

// exports.requireSignin = expressjwt({
//   secret: process.env.JWT_SECRET,
//   algorithms: ["HS256"], // added later
//   userProperty: "auth",
// });
// exports.requireSignin = expressjwt({
  // GetVerificationKey = (req: express.Request, token: jwt.Jwt | undefined) => Promise<jwt.Secret>;
  
  // credentialsRequired: true,
  // secret: process.env.JWT_SECRET,
  // secret: `vjhug`,
  // algorithms: ["HS256"],
  // requestProperty: "user",
  // getToken: function fromCookie (req) {
  //   var token = req.cookies.access_token || req.body.access_token || req.query.access_token || req.headers['x-access-token'] ;
  //   if (token) {
  //     return token;
  //   } 
  //   return null;
  // }
// })

exports.requireSignin=(req,res,next)=>{
  const token= jwt.sign({
    email:"abcd@gmail.com"
  },"xyz")
  req.token=token
  next()
}
 
exports.isAuth = async(req, res, next) => {
  // let user = req.profile && req.auth && req.profile._id == req.auth._id;
  // if (!user) {
  //   return res.status(403).json({
  //     error: "Access denied",
  //   });
  // }
  // next(); 
  let user= await User.findById(req.params.userId)
  if(!user){
    res.status(403).json({
          error: "Access denied",
        });
  }
  req.user=user
  next()
};

exports.isAdmin = (req, res, next) => {
  // console.log("role",req.user.role)
  if (req.user.role === 0) { 
    return res.status(403).json({
      error: "Admin resource! Access denied!!!",
    });
  }
  next();
};
 