import UserRepository from "../models/repository/user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerView(req, res) {
    res.locals.metaData = {
      title: "SignUp",
    };

    res.render("register", { layout: "login-layout" });
  }

  async register(req, res) {
    try {
      const { email, password, confirm_password } = req.body;
      const profileImage = req.file?.filename;
      // Validation
      if (!profileImage || !email || !password || !confirm_password) {
        req.flash("error", "All fields are required!");
        return res.redirect("/signup");
      }
      if (password !== confirm_password) {
        req.flash("error", "Passwords do not match!");
        return res.redirect("/signup");
      }

      // Check if the user already exists
      const existingUser = await this.userRepository.findByEmail(email);

      console.log("existingUser", existingUser);
      if (existingUser) {
        req.flash("error", "Email already exist with out DB!");
        return res.redirect("/signup");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user
      const userData = {
        email,
        password: hashedPassword,
        profile_image: profileImage,
      };
      const result = await this.userRepository.create(userData);
      if (result) {
        req.flash("success", "User created Successfully!");
        return res.redirect("/");
      } else {
        req.flash("error", "Something went wrong");
        return res.redirect("/signup");
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  async loginView(req, res) {
    res.locals.metaData = {
      title: "Login",
    };
    res.render("login", { layout: "login-layout" });
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists in DB
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        req.flash("error", "Invalid Credentials");
        return res.redirect("/");
      }

      // Validate password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        req.flash("error", "Invalid Credentials");
        return res.redirect("/");
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_TOKEN_EXPIRE }
      );

      // Set token in HttpOnly cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Redirect to dashboard
      if (user) {
        return res.redirect("/dashboard");
      } else {
        req.flash("error", "Unauthorized Role");
        return res.redirect("/");
      }
    } catch (err) {
      console.error("Error:", err);
      req.flash("error", "something went wrong");
      return res.redirect("/");
    }
  }

  async dashboard(req, res) {
    res.locals.metaData = {
      title: "Dashboard",
      url: req.url,
    };
    try {
      const users = await this.userRepository.findByEmail(req.user.email);
      res.render("dashboard", { user: users });
    } catch (err) {
      console.log("error in data", err);
      return res.redirect("/dashboard");
    }
  }
}

export default UserController;
