import express from "express";
import userAuth from "../middleware/userauth.js";
import { addSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";

const skillRouter = express.Router();

skillRouter.post('/add', userAuth, addSkill);
skillRouter.put('/update', userAuth, updateSkill);
skillRouter.delete('/delete', userAuth, deleteSkill);

export default skillRouter;
