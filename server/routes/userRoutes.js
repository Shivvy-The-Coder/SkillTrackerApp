import express from "express";
import userAuth from "../middleware/userauth.js";
import { getDashboardData, getUserData , updatePersonalInfo } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/data', userAuth,getUserData);
userRouter.get('/dashboard', userAuth, getDashboardData);
userRouter.put('/personal-info', userAuth, updatePersonalInfo);

export default userRouter;
// check