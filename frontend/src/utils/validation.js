import * as Yup from "yup";
export const userValidation = Yup.object({
  fullName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(
      /[a-zA-Z]/,
      "Password must contain both upper and lower case letters."
    )
    .matches(/[0-9]+/, "Password must contain at least one number.")
    .matches(
      /[@$!%*?&]+/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &, _, etc.)."
    ),
});
export const loginValidation = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(
      /[a-zA-Z]/,
      "Password must contain both upper and lower case letters."
    )
    .matches(/[0-9]+/, "Password must contain at least one number.")
    
});


export const pinValidation = Yup.object({
  pin1: Yup.string().required("Required").length(1, "Invalid"),
  pin2: Yup.string().required("Required").length(1, "Invalid"),
  pin3: Yup.string().required("Required").length(1, "Invalid"),
  pin4: Yup.string().required("Required").length(1, "Invalid"),
});

export const userDetailsCalidation = Yup.object({
  fullName: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  dob: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  presentAddress: Yup.string().required("Required"),
  permAddress: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  postalCode: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  ssn: Yup.string().required("Required"),
});
export const preferencesValidation = Yup.object({
  currency: Yup.string().required("Required"),
  timeZone: Yup.string().required("Required"),
  
});

export const passwordValidation = Yup.object({
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(
      /[a-zA-Z]/,
      "Password must contain both upper and lower case letters."
    )
    .matches(/[0-9]+/, "Password must contain at least one number.")
    .matches(
      /[@$!%*?&]+/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &, _, etc.)."
    ),

  confirmPassword: Yup.string()
    .required("Confirming your password is required.")
    .oneOf([Yup.ref("password"), null], "Passwords must match."),
});

export const newsletterValidation = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
});
export const amountValidation = Yup.object({
  balance: Yup.number().required("Required").min(5),
});