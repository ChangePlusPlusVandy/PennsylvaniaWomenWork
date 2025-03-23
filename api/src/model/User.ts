import mongoose from "mongoose";

// User schema definition
const userSchema = new mongoose.Schema({
  sub: String, // Auth0 ID
  email: String,
  username: String,
  role: String,
  firstName: String,
  lastName: String,
  mentor_id: String,
});

const User = mongoose.model("User", userSchema);

export default User;
