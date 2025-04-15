import UserModel from "../schema/user.model.js";

class UserRepository {
    
  async findByEmail(email) {
    try {
      const user = await UserModel.findOne({ email: email });
      return user;
    } catch (err) {
      console.log("Error in fetching data", err);
    }
  }

  // Add 
  async create(userData) {
    try {
      const data = new UserModel(userData);
      return await data.save();
    } catch (err) {
      console.log("Error ", err);
    }
  }
  // End
}

export default UserRepository;
