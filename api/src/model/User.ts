import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth_id: String, // Auth0 ID
  email: String,
  username: String,
  role: String,
  first_name: String,
  last_name: String,
  mentor_id: String,
  profile_picture_id: { type: String, default: null },
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }], // Store workshop IDs
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "BoardFile" }], // Store BoardFile IDs
});

const User = mongoose.model("User", userSchema);

export default User;
