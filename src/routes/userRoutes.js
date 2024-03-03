import { Router } from "express";
import { getAllUsers, logoutUser, userLogin, userSignup, verifyUser } from "../controllers/user.controller.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/tokenManager.js";
const userRouter=Router();
userRouter.get('/',getAllUsers)
userRouter.post('/signup',validate(signupValidator),userSignup)
userRouter.post('/login',validate(loginValidator),userLogin)
userRouter.get('/auth-status',verifyToken,verifyUser)
userRouter.get('/logout',verifyToken,logoutUser)


export default userRouter