import AdminModel from "../models/AdminModel.js";
import UserModel from "../models/UserModel.js";
import { v2 as cloudinary } from "cloudinary";

const HandleGetAllUsers = (req, res) => {
  try {
    res.send("MVC WORKING, Welcome");
  } catch (error) {
    console.log(error);
  }
};

const HandleSignup = async (req, res) => {
  try {
    const { username, email, password, role, phone } = req.body;
    const findUser =
      (await UserModel.findOne({ email })) || (await AdminModel.findOne({email }));


    if (findUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    if (role.includes("Admin")) {
      const newAdmin = new AdminSchema({
        username,
        email,
        password,
        role
      });
      await newAdmin.save();
      const token = {
        username: newAdmin.username,
        email: newAdmin.email,
        password: newAdmin.password,
        role: newAdmin.role
      };
      return res
        .status(201)
        .json({ message: "Admin Signed Up Successfully", token: token });
    } else if (role.includes("User")) {
      const newUser = new UserModel({
        username,
        email,
        password,
        role,
        phone
      });
      await newUser.save();
      const token = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      };
      return res
        .status(201)
        .json({ message: "User Registered Successfully", token: token });
    } else {
      res.status(400).json({ message: "Invalid Request" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const HandleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findRoles =
      (await UserModel.findOne({ email, password })) ||
      (await AdminModel.findOne({ email, password }));

    if (!findRoles) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    if (email !== findRoles.email || password !== findRoles.password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (findRoles.role.includes("User")) {
      const token = {
        _id: findRoles._id.toString(),
        username: findRoles.username,
        email: findRoles.email,
        phone: findRoles.phone,
password: findRoles.password,
        role: findRoles.role,
        profile_image: findRoles.profile_image
      };
      return res.status(200).json({ message: "Logged In Successfully", token });
    } else if (findRoles.role.includes("Admin")) {
      const token = {
        _id: findRoles._id.toString(),
        username: findRoles.username,
        email: findRoles.email,
        role: findRoles.role
      };
      return res.status(200).json({ message: "Logged In Successfully", token });
    } else {
      res.status(403).json({ message: "Invalid Login Request" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const HandleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser =
      (await UserModel.findOne({ email: email })) ||
      (await AdminModel.findOne({ email: email }));

    if (!findUser) {
      return res
        .status(404)
        .json({ message: "Sorry, Account With This Email Doesn't Exists" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const getOtpCode = otpCode;
    const getOtpExpire = Date.now() + 600000;

    findUser.OtpCode = getOtpCode || findUser.OtpCode;
    findUser.OtpExp = getOtpExpire || findUser.OtpExp;

    await findUser.save();

    // autoMailer(
    //     {
    //         from: 'wasifmehmood903@gmail.com',
    //         to: findUser.email,
    //         subject: 'OTP VERIFICATION CODE',
    //         message: `<h3>Your OTP Verification Code Is: </h3>
    //         <h3> ${findUser.OtpCode}</h4>`
    //     }
    // );

    console.log("Your Otp is", otpCode);

    res.status(200).json({ message: "OTP Sent To Your Email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const HandleVerifyOtp = async (req, res) => {
  try {
    const { email, OtpCode } = req.body;
    const findUser =
      (await AdminModel.findOne({ email: email })) ||
      (await UserModel.findOne({ email: email }));

    if (!findUser) {
      return res.status(404).json({
        message: "Sorry, We couldn't send your OTP Verification Code"
      });
    }
    if (OtpCode === "") {
      return res.status(404).json({ message: "OTP Field Is Required" });
    }
    if (findUser.OtpCode !== Number(OtpCode)) {
      console.log(findUser.OtpCode);
      console.log(OtpCode);
      return res.status(404).json({ message: "Invalid OTP Verification Code" });
    }
    if (
      findUser.OtpCode === Number(OtpCode) &&
      findUser.OtpExp &&
      findUser.OtpExp > new Date()
    ) {
      return res.status(200).json({ message: "OTP Verified Successfully" });
    } else {
      return res.status(404).json({ message: "OTP has expired or is invalid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const HandleResetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const findUser =
      (await AdminModel.findOne({ email: email })) ||
      (await UserModel.findOne({ email: email }));
    if (!findUser) {
      return res.status(404).json({
        message: "Sorry, Some Error Occured While Resetting Password"
      });
    }
    if (password !== confirmPassword) {
      return res.status(404).json({ message: "Passwords Must Be Same" });
    }
    findUser.password = password || findUser.password;
    await findUser.save();
    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const HandleResendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const userExists =
      (await AdminModel.findOne({ email: email })) ||
      (await UserModel.findOne({ email: email }));

    if (!userExists) {
      return res.status(404).json({ message: "This Email Doesn't Exist" });
    }

    const otpCode = await Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const getOtpCode = otpCode;
    const getOtpExpire = Date.now() + 600000;

    userExists.OtpCode = getOtpCode || userExists.OtpCode;
    userExists.OtpExp = getOtpExpire || userExists.OtpExp;

    await userExists.save();

    // autoMailer({
    //   to: userExists.email,
    //   subject: "OTP VERIFICATION CODE",
    //   message: `<h3>Your OTP Verification Code Is: </h3>
    //           <h3> ${userExists.OtpCode}</h4>`
    // });

    res.status(200).json({ message: "OTP Re-Sent Successfully To Your Email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const HandleUpdateProfile = async (req, res) => {
  try {
    const { userID } = req.params;

    const { email, username, phone, role, password } = req.body;

    const profile_image = req?.files?.profile_image;

    const uploadResult = profile_image ? await cloudinary.uploader.upload(profile_image.tempFilePath, {
        resource_type: 'image',
        folder: `NoFair User`,
    }) : '';

    const findUser = await UserModel.findById(userID);
    if (!findUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    findUser.email = email || findUser.email;
    findUser.username = username || findUser.username;
    findUser.phone = phone || findUser.phone;
    findUser.role = role || findUser.role;
    findUser.password = password || findUser.password;
    findUser.profile_image = uploadResult.secure_url || findUser.profile_image;

    await findUser.save();
    res.status(200).json({ message: "User Updated Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  HandleGetAllUsers,
  HandleSignup,
  HandleLogin,
  HandleForgotPassword,
  HandleVerifyOtp,
  HandleResetPassword,
  HandleResendOtp,
  HandleUpdateProfile
};
