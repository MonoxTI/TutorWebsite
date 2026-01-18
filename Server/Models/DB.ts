import mongoose, {Schema} from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true}
});

const AppointmentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    FullName: {type: String, required: true},
    Email: {type: String, required: true},
    Number: {type: Number, required: true},
    package: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    tutor: {type: String, required: true}
});

const AppointmentDetailsSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    PaymentStatus: {type: String, required: true},
    Performance: {type: String, required: true},
    TransactionID: {type: String, required: true},
    AmountPaid: {type: Number, required: true},
    invoiceNumber: {type: String, required: true},
    Note: {type: String, required: false}
});

export const UserModel = mongoose.model('User', UserSchema);
export const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);
export const AppointmentDetailsModel = mongoose.model('AppointmentDetails', AppointmentDetailsSchema);

export default {UserModel, AppointmentModel, AppointmentDetailsModel};