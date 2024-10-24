import { Schema, model, Document } from 'mongoose';
import { Group, IGroup } from './Group';

// Define the IUser interface
interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    role: 'mentee' | 'mentor' | 'admin';
    name: string;
    username: string;
    email: string;
    auth0Id: string;
    meetingSchedule?: string; // optional for admin
    mentorData?: { // data from mentors to mentees
        mentorId: Schema.Types.ObjectId;
        notes: string;
    };
    courses?: { // metadata for resources from mentors 
        title: string;
        type: 'pdf' | 'image' | 'video';
        url: string;
    }[];
    menteesInfo?: { // for mentors
        menteeId: Schema.Types.ObjectId;
        meetingNotes: string;
    }[];
    meetingsInfo?: {
        meetingId: Schema.Types.ObjectId;
        details: string;
    }[];
    groups: (Schema.Types.ObjectId | IGroup)[];
    friends: (Schema.Types.ObjectId | IUser)[];
    addFriend: (friendId: string) => Promise<void>;
}

// Mongoose User Schema
const userSchema: Schema<IUser> = new Schema({
    // _id: { type: String, default: uuid.v4 },
    role: { type: String, enum: ['mentee', 'mentor', 'admin'], required: true},
    name: { type: String, required: true },
    username: { type: String, required: true, unqiue: true },
    email: { type: String, required: true, unqiue: true },
    auth0Id: { type: String, required: true },

    meetingSchedule: {type: String },
    mentorData: {
        mentorId: { type: Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String }
    },
    courses: [
        {
            title: { type: String },
            type: { type: String, enum: ['pdf', 'image', 'video'] },
            url: { type: String }
        }
    ],
    menteesInfo: [
        {
            menteeId: { type: Schema.Types.ObjectId, ref: 'User' },  // Link to mentee
            meetingNotes: { type: String }
        }
    ],
    meetingsInfo: [
        {
            meetingId: { type: Schema.Types.ObjectId },
            details: { type: String }
        }
    ],

    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

// Instance method to add a friend
userSchema.methods.addFriend = async function (friendId: Schema.Types.ObjectId): Promise<void> {
    this.friends.push(friendId);   // Modify the friends array
    await this.save();             // Save the updated user document
};

// Mongoose Model
const User = model<IUser>('User', userSchema);

//export User model and IUser interface
export { User, IUser };