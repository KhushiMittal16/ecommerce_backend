exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required").notEmpty();
  req.check("email", "email is required").notEmpty();
  req
    .check("email", "please enter a valid email address")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must have @");
  req
    .check("password", "password must be 8 characters long")
    .isLength({
      min: 8,
      max: 15,
    })
    .matches(/\d/)
    .withMessage("Password must contain a number");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
