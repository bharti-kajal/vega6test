import BlogModel from "../schema/blog.model.js";

class BlogRepository {

  async findById(blogId) {
    try {
      const user = await BlogModel.findOne({ _id: blogId });
      return user;
    } catch (err) {
      console.log("Error in fetching data", err);
    }
  }

  // Get
  async get(userId) {
    try {
      return await BlogModel.find({"userId":userId});
    } catch (err) {
      console.log("Error ", err);
    }
  }

  // Add 
  async create(insertData) {
    try {
      const data = new BlogModel(insertData);
      return await data.save();
    } catch (err) {
      console.log("Error ", err);
    }
  }
  // End

  // Update 
  async update(userId, data) {
    try {
      return await BlogModel.findByIdAndUpdate(userId, data);
    } catch (err) {
      consoel.log("Error", err);
    }
  }
  // End

  // Delete 
  async delete(id) {
    try {
      return await BlogModel.findByIdAndDelete(id);
    } catch (err) {
      console.log("Err ", err);
    }
  }
  // End
}

export default BlogRepository;
