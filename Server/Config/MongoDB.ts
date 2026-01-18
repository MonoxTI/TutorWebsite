import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database connected'));
    mongoose.connection.on('error', (err) => console.log(`Database connection error: ${err}`));

    await mongoose.connect(`${process.env.MONGO_URI}/MERN`)
}
export default connectDB;