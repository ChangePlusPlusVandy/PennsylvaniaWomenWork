import mongoose, { Schema, Document } from "mongoose";

interface IBoardFile extends Document {
  name: string;
  description: string;
  coverImageS3id?: string;
  createdAt: Date;
}

const BoardFileSchema: Schema<IBoardFile> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverImageS3id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const BoardFile = mongoose.model<IBoardFile>("boardFile", BoardFileSchema);
export { BoardFile, IBoardFile };
