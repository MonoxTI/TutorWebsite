import express,{ Application } from "express";
/*
import { LoginUser} from ".";
import { RegisterUser } from "../Controller/registerController";
import { BookAppointment } from "../Controller/appointmentController";
import { GetAppointments } from "../Controller/getAppointmentsController";
*/

const router = express.Router();

//eg - router.post('/Prop', EnterProp);
router.post('/login', LoginUser);
router.post('/register', RegisterUser);
router.post('appoinment', BookAppointment);
router.get('/getAppointments', GetAppointments);

export default router;