import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  sub: String, // Auth0 ID
  email: String,
  username: String,
  role: String,
  firstName: String,
  lastName: String,
  mentor_id: String,
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }], // Store workshop IDs
});

const User = mongoose.model("User", userSchema);

export default User;
