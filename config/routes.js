import express from "express";
import UserController from "../src/controllers/user.controller.js";
import BlogController from "../src/controllers/blog.controller.js";
import Auth from "../src/middlewares/auth.middleware.js";
import { upload } from "../src/middlewares/file-upload.middleware.js";

const router = express.Router();
const userController = new UserController();
const blogController = new BlogController();

// User Routes
router.get("/", redirectIfAuthenticated, userController.loginView.bind(userController));

router.post("/login", (req, res) => {
  userController.login(req, res);
});

router.get("/signup", (req, res) => {
  userController.registerView(req, res);
});

router.post("/add-user", upload.single("profileImage"), (req, res) => {
  userController.register(req, res);
});

router.get("/dashboard", Auth, (req, res) => {
  userController.dashboard(req, res);
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  req.flash("success", "Logged out successfully");
  res.redirect("/");
});
// End User Routes

// Blog Routes
router.post("/add-blog", Auth, upload.single("blogImage"), (req, res) => {
  blogController.add(req, res);
});

router.get("/blogs", Auth, (req, res) => {
  blogController.get(req, res);
});

router.post("/edit-blog", Auth, upload.single("blogImage"), (req, res) => {
  blogController.update(req, res);
});

router.post("/delete-blog", Auth, (req, res) => {
  blogController.delete(req, res);
});

router.get("/blogs/:id", Auth, (req, res) => {
  blogController.showContent(req, res);
});
// End Blog Routes

export default router;
