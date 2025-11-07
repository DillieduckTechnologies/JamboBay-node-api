const Yup = require("yup");

exports.loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

exports.verifyEmailSchema = Yup.object().shape({
  token: Yup.string().required("Verification token is required"),
});

exports.forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
});

exports.resetPasswordSchema = Yup.object().shape({
  token: Yup.string().required("Reset token is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
