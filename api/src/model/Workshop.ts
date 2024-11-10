import mongoose, { Schema, Document } from "mongoose";
// interface
interface IWorkshop extends Document {
  mentor: Schema.Types.ObjectId; // TODO: add mentor type
  mentee: Schema.Types.ObjectId; // TODO: add mentee type
  textContent: string;
  createdAt: Date;

  updateContent(newContent: string): Promise<void>;
}

// workshop schema
const WorkshopSchema: Schema<IWorkshop> = new Schema({
  mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mentee: { type: Schema.Types.ObjectId, ref: "User", required: true },
  textContent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// update text content of the workshop
WorkshopSchema.methods.updateContent = async function (
  newContent: string,
): Promise<void> {
  this.textContent = newContent;
  await this.save();
};

// mongoose model
const Workshop = mongoose.model<IWorkshop>("Workshop", WorkshopSchema);
export { Workshop, IWorkshop };
