import mongoose, { Schema, Document } from "mongoose";

interface IBoardFile extends Document {
  name: string;
  description: string;
  coverImageS3id?: string;
  tags: string[];
}

const BoardFileSchema: Schema<IBoardFile> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverImageS3id: { type: String, required: true },
  tags: [{ type: String }],
});

const BoardFile = mongoose.model<IBoardFile>("boardFile", BoardFileSchema);
export { BoardFile, IBoardFile };
