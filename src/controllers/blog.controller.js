import BlogRepository from "../models/repository/blog.repository.js";
import UserRepository from "../models/repository/user.repository.js";

class BlogController {
  constructor() {
    this.blogRepository = new BlogRepository();
    this.userRepository = new UserRepository();
  }

  async add(req, res) {
    try {
      const { title, description } = req.body;
      const blogImage = req.file?.filename;
      // Validation
      if (!blogImage || !title || !description) {
        req.flash("error", "All fields are required!");
        return res.redirect("/blogs");
      }

      // Save
      const insertData = {
        title,
        description: description,
        blog_image: blogImage,
        userId: req.user.userId,
      };

      const result = await this.blogRepository.create(insertData);
      if (result) {
        req.flash("success", "Blog created Successfully!");
        return res.redirect("/blogs");
      } else {
        req.flash("error", "Something went wrong");
        return res.redirect("/blogs");
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  async get(req, res) {
    res.locals.metaData = {
      title: "Blog List",
      url: req.url,
    };
    try {
      const users = await this.userRepository.findByEmail(req.user.email);
      const blogs = await this.blogRepository.get(req.user.userId);
      console.log("blogs", blogs);
      res.render("blog", { blogs: blogs, user: users });
    } catch (err) {
      console.log("error in data", err);
      req.flash("error", "Unauthorized Role");
      return res.redirect("/blogs");
    }
  }

  async update(req, res) {
    try {
      console.log("req.bosy", req.body);
      const { blogId, title, description } = req.body;
      const blogImage = req.file?.filename;

      // Check if blog exists
      const blog = await this.blogRepository.findById(blogId);
      if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/blogs");
      }

      // Update data
      const updatedBlog = await this.blogRepository.update(blogId, {
        title,
        description,
        blog_image: blogImage,
      });

      req.flash("success", "Blog updated successfully");
      return res.redirect("/blogs");
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const blog = await this.blogRepository.findById(req.body.blogId);
      if (!blog) {
        req.flash("error", "Blog not found");
        return res.redirect("/blogs");
      } else {
        const result = await this.blogRepository.delete(req.body.blogId);
        req.flash("success", "Delete Successfully!");
        return res.redirect("/blogs");
      }
    } catch (error) {
      req.flash("error", "Something went wrong!");
      return res.redirect("/blogs");
    }
  }
  // Express route
  async showContent(req, res) {
    try {
      const blog = await this.blogRepository.findById(req.params.id);
      if (!blog) return res.status(404).json({ error: "Blog not found" });
      res.json({
        title: blog.title,
        content: blog.description,
        id: blog._id,
        blog_image: blog.blog_image,
      });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}

export default BlogController;
