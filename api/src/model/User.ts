import { Schema, model, Document } from 'mongoose';
import { Group, IGroup } from './Group';

// Define the IUser interface
interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  groups: (Schema.Types.ObjectId | IGroup)[];
  friends: (Schema.Types.ObjectId | IUser)[];
  addFriend: (friendId: string) => Promise<void>;
}

// Mongoose User Schema
const userSchema: Schema<IUser> = new Schema({
  // _id: { type: String, default: uuid.v4 },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// Instance method to add a friend
userSchema.methods.addFriend = async function (
  friendId: Schema.Types.ObjectId,
): Promise<void> {
  this.friends.push(friendId); // Modify the friends array
  await this.save(); // Save the updated user document
};

// Mongoose Model
const User = model<IUser>('User', userSchema);

//export User model and IUser interface
export { User, IUser };
