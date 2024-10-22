import mongoose, { Schema, Document } from 'mongoose';
import { User, IUser } from './User'; // Import User interface
import { IExpense } from './Expense'; // Import Expense interface

// Interface for the Group document
interface IGroup extends Document {
  _id: Schema.Types.ObjectId;
  groupName: string;
  groupDescription: string;
  members: (Schema.Types.ObjectId | IUser)[];
  expenses: (Schema.Types.ObjectId | IExpense)[];
  leader: Schema.Types.ObjectId | IUser;

  addMember(user: IUser): Promise<void>;
  removeMember(userID: string): Promise<void>;
  notifyNewExpense(expense: IExpense): Promise<void>;
  viewGroupBalance(): Promise<number>;
  viewSettledAndUnsettledExpenses(): Promise<{
    settled: IExpense[];
    unsettled: IExpense[];
  }>;
}

// Mongoose Group Schema
const groupSchema: Schema<IGroup> = new Schema({
  // groupID: { type: String, default: uuid.v4 },
  groupName: { type: String, required: true },
  groupDescription: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: User.modelName }], // List of User references
  expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }], // List of Expense references
  leader: { type: Schema.Types.ObjectId, ref: User.modelName, required: true }, // Leader of the group
});

// Method to add a member to the group
groupSchema.methods.addMember = async function (user: IUser): Promise<void> {
  if (!this.members.includes(user._id)) {
    this.members.push(user._id); // Add user to the members array
    await this.save(); // Persist changes
  }
};

// Method to remove a member from the group by userID
groupSchema.methods.removeMember = async function (
  userID: Schema.Types.ObjectId,
): Promise<void> {
  this.members = this.members.filter((member: IUser) => member._id !== userID);
  await this.save(); // Persist changes
};

// Method to notify members of a new expense
// NEEDS TO NOTIFY MEMBERS
groupSchema.methods.notifyNewExpense = async function (
  expense: IExpense,
): Promise<void> {
  this.expenses.push(expense._id); // Add the new expense to the expenses array
  await this.save(); // Persist changes
  // Here you would trigger any notification system if needed
};

// // Method to view the total group balance
// groupSchema.methods.viewGroupBalance = async function (): Promise<number> {
//     let totalBalance = 0;
//     for (const expense of this.expenses) {
//         totalBalance += expense.amount;  // Assuming 'amount' is a field in IExpense
//     }
//     return totalBalance;
// };

// // Method to view settled and unsettled expenses
// groupSchema.methods.viewSettledAndUnsettledExpenses = async function (): Promise<{ settled: IExpense[], unsettled: IExpense[] }> {
//     const settled: IExpense[] = [];
//     const unsettled: IExpense[] = [];

//     for (const expense of this.expenses) {
//         if (expense.isSettled) {  // Assuming 'isSettled' is a field in IExpense
//             settled.push(expense);
//         } else {
//             unsettled.push(expense);
//         }
//     }
//     return { settled, unsettled };
// };

// Mongoose Group Model
const Group = mongoose.model<IGroup>('Group', groupSchema);

export { Group, IGroup };
