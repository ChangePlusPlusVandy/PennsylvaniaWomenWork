import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  sub: String, // Auth0 ID
  email: String,
  username: String,
  role: String,
  firstName: String,
  lastName: String,
  mentor_id: String,
  workshopIDs: [{ type: Schema.Types.ObjectId, ref: "Workshop" }], // ✅ Add this!
});

const User = mongoose.model("User", userSchema);

export default User;
