import express,{ Application } from "express";
// import { UserRoutes } from "./UserRoutes";

const router = express.Router();

//eg - router.post('/Prop', EnterProp);
router.post('/login', LoginUser);
router.post('/register', RegisterUser);
router.post('appoinment', BookAppointment);
router.get('/getAppointments', GetAppointments);

export default router;