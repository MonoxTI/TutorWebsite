import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// ─── User Interfaces ────────────────────────────────────────

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

// ─── Appointment Interfaces ─────────────────────────────────

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  FullName: string;
  Email: string;
  Number: number;
  package: string;
  date: Date;
  time: string;
  tutor: string;
}

// ─── AppointmentDetails Interfaces ──────────────────────────

export interface IAppointmentDetails extends Document {
  userId: mongoose.Types.ObjectId;
  PaymentStatus: string;
  Performance: string;
  TransactionID: string;
  AmountPaid: number;
  invoiceNumber: string;
  Note?: string;
}

// ─── User Schema with Pre-save Hook ─────────────────────────

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Add instance method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Appointment Schema ─────────────────────────────────────

const AppointmentSchema = new Schema<IAppointment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  FullName: { type: String, required: true },
  Email: { type: String, required: true },
  Number: { type: Number, required: true },
  package: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  tutor: { type: String, required: true }
});

// ─── AppointmentDetails Schema ──────────────────────────────

const AppointmentDetailsSchema = new Schema<IAppointmentDetails>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  PaymentStatus: { type: String, required: true },
  Performance: { type: String, required: true },
  TransactionID: { type: String, required: true },
  AmountPaid: { type: Number, required: true },
  invoiceNumber: { type: String, required: true },
  Note: { type: String, required: false }
});

// ─── Models ─────────────────────────────────────────────────

export const UserModel = mongoose.model<IUser, UserModel>('User', UserSchema);
export const AppointmentModel = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export const AppointmentDetailsModel = mongoose.model<IAppointmentDetails>(
  'AppointmentDetails',
  AppointmentDetailsSchema
);

// Optional: Export as a grouped object (for convenience)
const Models = {
  UserModel,
  AppointmentModel,
  AppointmentDetailsModel
};

export default Models;