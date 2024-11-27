import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendMail } from "./SendMail.js";
import Plan from "../models/Plan.js";
import Documents from "../models/Documents.js";
import axios from "axios";

export const login = async (req, res) => {
  let signdetails = req.body;

  const user = await User.findOne({ email: signdetails.email })
    .populate("subscriptionPlan")
    .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
    .populate("documents")
    .populate("letters");

  if (!user) {
    return res.status(404).json({ error: "Email not found" });
  }

  // console.log("signdetails", signdetails.password);
  // console.log("user ", user);
  // console.log("user password", user.password);

  const passwordConfrimed = bcrypt.compareSync(
    signdetails.password,
    user.password
  );

  if (!passwordConfrimed) {
    return res.status(404).json({ error: "Invalid Password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWTSECRET,
    {
      expiresIn: "12h",
    }
  );
  delete user.password;

  res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({
      user, token
    });
};
export const loginGoogle = async (req, res) => {
  try {
    const signdetails = req.body;
    const user = await User.findOne({ email: signdetails.email })
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("letters")
      .populate("documents")
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ error: "Email not verified" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWTSECRET,
      { expiresIn: "1h" }
    );

    delete user.password;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax", // or 'strict' depending on your requirements
        secure: process.env.NODE_ENV === "production", // Set secure to true if in production (uses HTTPS)
      })
      .status(200)
      .json({ user, token });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req, res) => {
  // Handle POST request to create User

  let detail = await req.body;

  try {
    const emailExists = await User.findOne({ email: detail.email });

    if (emailExists) {
      res.status(409).json({ error: "Email already exists" });
      return false;
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(
      detail.password || "Google123",
      salt
    );

    const OTP = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);

    detail.otp = OTP;

    detail.password = hashedPassword;

    // fetch freeplan

    const freePlan = await Plan.findOne({ name: "Basic" });
    detail.subscriptionPlan = freePlan._id;
    detail.planEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const createUser = await User.create(detail);
    const populatedUser = await User.findById(createUser._id)
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("documents")
      .select("-password");

    if (createUser) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        process.env.JWTSECRET,
        { expiresIn: "1h" }
      );
      sendMail(detail.email, "Verify Account", html(populatedUser));
      res.status(201).json({ user: populatedUser, token });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const resendMail = async (req, res) => {
  const { email } = req.params;
  let otp = "";

  try {
    const user = await User.findOne({
      email: email,
    }).lean();
    if (user) {
      otp = user.otp;
    }
    sendMail(email, "Verication Code", html(user));
  } catch (err) {
    console.log(err);
  }
};

export const verifyMail = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    if (user.otp == req.body.pin) {
      User.findOneAndUpdate(
        {
          email: req.params.email,
        },
        {
          emailVerified: true,
        },
        {
          new: true,
        }
      ).then(() => {
        res.status(200).json({ user });
      });
    } else {
      res.status(400).json({
        error: "Invalid code",
      });
    }
  } catch (err) {
    res.status(500).json(err, {
      error: err,
    });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    User.findByIdAndUpdate({ _id: userId }, { $set: req.body }, { new: true })
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("letters")
      .select("-password")
      .then((user) =>
        res.status(200).json({ user, message: "User Updated Successfully" })
      );
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;
  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    User.findByIdAndUpdate(
      { _id: userId },
      { password: hashedPassword },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .select("-password")
      .then((user) =>
        res.status(200).json({ user, message: "Password Updated Successfully" })
      );
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateImage = async (req, res) => {
  const { userId } = req.params;
  try {
    User.findByIdAndUpdate(
      { _id: userId },
      {
        image:
          process.env.SERVER_URL +
          "/images/" +
          req.file.filename.replace(/\\/g, "/"),
      },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("documents")
      .populate("letters")
      .select("-password")
      .then((user) => {
        res.status(200).json({ user });
      });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const updateDocument = async (req, res) => {
  try {
    if (!req.file?.filename) {
      throw new Error("File path is undefined");
    }

    const documentPath = `${
      process.env.SERVER_URL
    }/images/${req.file.filename.replace(/\\/g, "/")}`;
    console.log("Document Path: ", documentPath);

    const createDocument = await Documents.create({
      userId: req.params.userId,
      name: req.body.name,
      path: documentPath,
    });

    if (!createDocument) {
      return res.status(409).json({ error: "Document creation failed" });
    }

    // Add the created document to the user's documents array
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { documents: createDocument._id } },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("letters")
      .populate("documents")
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating document: ", error);
    res.status(400).json({ error: error.message });
  }
};

export const verifySSN = async (req, res) => {
  try {
    const ssn = req.body.ssn;
    const userId = req.body.userId;

    const options = {
      method: "GET",
      url: `https://data.searchbug.com/api/search.aspx?CO_CODE=12690953&PASS=Finanzas@2020&TYPE=api_ppl&SSN=${ssn}&FORMAT=JSON`,
      headers: {
        // Add any necessary headers here
      },
    };

    const response = await axios.request(options);


    console.log(response.data)

    const isValid = response.data.is_valid; // Adjust based on actual response structure

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { ssnVerified: isValid, ssn: ssn },
      { new: true }
    )
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("letters")
      .populate("documents")
      .select("-password");

    console.log(isValid);
    if (isValid === "FALSE") {
      const message = "Incorrect SSN, please verify";
      res.status(200).json({ message, user, is_valid: isValid });
    } else {
      const message = "SSN Verified";
      res.status(200).json({ message, user, is_valid: isValid });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error verifying SSN" });
  }
};

export const deductBalance = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findOne({ _id: req.body.userId })
      .populate("subscriptionPlan")
      .populate({
        path: "creditReport",
        options: { sort: { createdAt: -1 } }, 
      })
      .populate("letters")
      .populate("documents")
      .select("-password");

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Define the amount to deduct
    const amount = 2;

    // Check if the user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct the amount from the user's balance
    user.balance -= amount;

    // Save the updated user data in the database
    await user.save();

    // Return the updated user data
    res.status(200).json({ message: "Balance deducted", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const html = (user) => {
  return ` <center>
     <table data-group="Header" data-module="Center Logo" data-thumbnail="/editor/assets/local/thumbnails/2.png"
         border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="width:100%;max-width:100%;">
         <tr>
             <td data-bgcolor="Body Bgcolor" align="center" valign="middle" bgcolor="#F1F1F1"
                 style="background-color: #F1F1F1;">
                 <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="row"
                     style="width:600px;max-width:600px;">
                     <tr>
                         <td data-bgcolor="Bgcolor" align="center" bgcolor="#FFFFFF"
                             style="background-color: rgb(95, 193, 196);">
                             <table width="520" border="0" cellpadding="0" cellspacing="0" align="center"
                                 class="row" style="width:520px;max-width:520px;">
                                 <tr>
                                     <td align="center" class="container-padding">
                                         <table border="0" width="100%" cellpadding="0" cellspacing="0"
                                             align="center" style="width:100%; max-width:100%;">
                                             <tr>
                                                 <td data-resizable-height=""
                                                     style="font-size:40px;height:40px;line-height:40px;">&nbsp;</td>
                                             </tr>
                                             <tr>
                                                 <td align="center" valign="middle"><a href="${process.env.APP_URL}"
                                                         style="text-decoration:none;border:0"><img data-image="Logo"
                                                             width="140" border="0" alt="logo"
                                                             style="width:140px;border:0px;display:inline!important;"
                                                             src="{{ asset('assets/logo/gemrook-logo.png') }}"></a>
                                                 </td>
                                             </tr>
                                             <tr>
                                                 <td data-resizable-height=""
                                                     style="font-size:20px;height:20px;line-height:20px;">&nbsp;</td>
                                             </tr>
                                         </table>
                                     </td>
                                 </tr>
                             </table>
                         </td>
                     </tr>
                 </table>








             </td>
         </tr>
     </table>
     <table data-group="Other Module" data-module="Info Description"
         data-thumbnail="/editor/assets/local/thumbnails/8.png" border="0" width="100%" align="center"
         cellpadding="0" cellspacing="0" style="width:100%;max-width:100%;">
         <tr>
             <td data-bgcolor="Body Bgcolor" align="center" valign="middle" bgcolor="#F1F1F1"
                 style="background-color: #F1F1F1;">
                 <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="row"
                     style="width:600px;max-width:600px;">
                     <tr>
                         <td data-bgcolor="Bgcolor" align="center" bgcolor="#FFFFFF" style="background-color: #FFFFFF;">
                             <table width="520" border="0" cellpadding="0" cellspacing="0" align="center"
                                 class="row" style="width:520px;max-width:520px;">
                                 <tr>
                                     <td align="center" class="container-padding">
                                         <table border="0" width="100%" cellpadding="0" cellspacing="0"
                                             align="center" style="width:100%; max-width:100%;">
                                             <tr>
                                                 <td data-resizable-height=""
                                                     style="font-size:20px;height:20px;line-height:20px;">&nbsp;</td>
                                             </tr>
                                             <tr>
                                                 <td data-text="Title" data-font="Primary" align="center"
                                                     valign="middle"
                                                     style="font-family:'Poppins', sans-serif;color:#191919;font-size:32px;line-height:42px;font-weight:700;letter-spacing:0px;padding:0;padding-bottom:10px;">
                                                     Password Reset Link</td>
                                             </tr>
                                             <tr>
                                                 <td data-text="Description" data-font="Primary" align="center"
                                                     valign="middle"
                                                     style="font-family:'Poppins', sans-serif;color:#939393;font-size:14px;line-height:24px;font-weight:400;letter-spacing:0px;padding:0;padding-bottom:30px;">
                                                     Hello ${user.fullName} Find your verification code below</td>
                                             </tr>
                                             <tr>
                                                 <td data-text="Description" data-font="Primary" align="center"
                                                     valign="middle"
                                                     style="font-family:'Poppins', sans-serif;color:#131C30;font-size:30px;line-height:24px;font-weight:400;letter-spacing:0px;padding:0;padding-bottom:30px;">
                                                     ${user.otp}</td>
                                             </tr>
                                            
                                             <tr>
                                                 <td data-resizable-height=""
                                                     style="font-size:20px;height:20px;line-height:20px;">&nbsp;</td>
                                             </tr>
                                         </table>
                                     </td>
                                 </tr>
                             </table>
                         </td>
                     </tr>
                 </table>
             </td>
         </tr>
     </table>
 </center>
`;
};
