import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User'; // Import User interface
import { IGroup } from './Group'; // Import Group interface

// Interface for the Expense document
interface IExpense extends Document {
  _id: Schema.Types.ObjectId;
  amount: number;
  description: string;
  category: string;
  group: Schema.Types.ObjectId | IGroup;
  status: string;
  receipt: File;
  date: Date;
  createdBy: Schema.Types.ObjectId | IUser;
  allocatedTo: Map<Schema.Types.ObjectId | IUser, number>;

  addReceipt(receipt: File): Promise<void>;
  editExpense(newAmount: number, newDescription: string): Promise<void>;
  deleteExpense(): Promise<void>;
  allocateExpense(portions: Map<IUser, number>): Promise<void>;
}

// Mongoose Expense Schema
const expenseSchema: Schema<IExpense> = new Schema({
  // expenseID: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true }, // Reference to Group
  status: { type: String, required: true }, // e.g., 'pending', 'settled'
  receipt: { type: Buffer }, // File storage for the receipt (you can handle file uploads in your app)
  date: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  allocatedTo: {
    type: Map,
    of: Number, // A map of User ObjectId and allocation amount
    required: true,
  },
});

// Method to add a receipt to the expense
expenseSchema.methods.addReceipt = async function (
  receipt: File,
): Promise<void> {
  this.receipt = receipt;
  await this.save();
};

// Method to edit the amount and description of the expense
expenseSchema.methods.editExpense = async function (
  newAmount: number,
  newDescription: string,
): Promise<void> {
  this.amount = newAmount;
  this.description = newDescription;
  await this.save();
};

// Method to delete the expense
expenseSchema.methods.deleteExpense = async function (): Promise<void> {
  await this.remove(); // Removes the document from the database
};

// Method to allocate portions of the expense to users
expenseSchema.methods.allocateExpense = async function (
  portions: Map<IUser, number>,
): Promise<void> {
  this.allocatedTo = portions; // Overwrite the existing allocations
  await this.save();
};

// Mongoose Expense Model
const Expense = mongoose.model<IExpense>('Expense', expenseSchema);

export { Expense, IExpense };
