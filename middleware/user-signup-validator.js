const { check, validationResult } = require("express-validator");

exports.userSignUpValidator = [
  check("firstName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("First name is missing"),
  check("firstName")
    .trim()
    .not()
    .isLength({
      min: 3,
    })
    .withMessage("First name is too short"),

  check("lastName").trim().not().isEmpty().withMessage("Last name is missing"),
  check("phoneNumber")
    .trim()
    .not()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  check("password").trim().not().isEmpty().withMessage("Password is required"),
];

exports.userSignUpValidate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.status(401).json({ error: error[0].msg });
  }
  next();
};
