import { Router } from "express";
import {verifyToken} from '../utils/tokenManager.js'
import { chatValidator,validate } from "../utils/validators.js";
import { deleteUserChats, generateChatCompletion, getUserChats } from "../controllers/chat.controller.js";

const chatRouter=Router();
chatRouter.post('/new',validate(chatValidator),verifyToken,generateChatCompletion);
chatRouter.get('/allchats',verifyToken,getUserChats);
chatRouter.delete('/deletechat',verifyToken,deleteUserChats);
export default chatRouter