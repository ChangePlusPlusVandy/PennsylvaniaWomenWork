import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {});
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
};

export default dbConnect;
