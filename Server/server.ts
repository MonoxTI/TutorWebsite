import express,{ Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./Router/Routes";
import connectDB from "./Config/MongoDB";


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

connectDB();

app.use(express.json());
app.use('/api', router);
app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});