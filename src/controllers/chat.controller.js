// import { configureOpenai } from "../config/opeai.config.js"
import User from "../models/user.model.js"
import {OpenAI} from 'openai'
import { asyncHandler } from "../utils/asyncHandler.js"

export const generateChatCompletion=async(req,res,next)=>{
    const {message}=req.body
    try {
        const user=await User.findById(res.locals.jwtData.id)
        if(!user)return res.status(401).json({message:"User not registeres or Tokens Malfunctioned"})
    
        //get chats of user
        
        const chats=user.chats.map(({role,content})=>({role,content}))
        chats.push({content:message,role:"user"})
        user.chats.push({content:message,role:"user"})
    
        //send all chats with new one to OpenAi API
        // const config=configureOpenai();
        const openai=new OpenAI({apiKey:process.env.OPENAI_API,
                                organization:process.env.OPENAI_ORGANIZATION,});
        const chatResponse=await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:chats
            // messages:[chats],
        });
        
        user.chats.push(chatResponse.choices[0].message);
        await user.save();
        return res.status(200).json({chats:user.chats})
    } catch (error) {
        return res.status(500).json({message:`Something Went wrong! : ${error} `})
    }



}
export const getUserChats=asyncHandler(async (req,res)=>{
    try {
        
        const user=await User.findById(res.locals.jwtData.id);
        if(!user)
            return res.status(401).send("User not registered  or token malfunctioned")
        
        if(user._id.toString()!== res.locals.jwtData.id ){
            return res.status(401).send("Permissions didn't match")

        }
        
        
        return res.status(200).json({message:"ok",chats:user.chats})
    } catch (error) {
        console.log(error)
       throw new ApiError(500,`error :${error.message}`)
        
    }
})

export const deleteUserChats=asyncHandler(async (req,res)=>{
    try {
        
        const user=await User.findById(res.locals.jwtData.id);
        if(!user)
            return res.status(401).send("User not registered  or token malfunctioned")
        
        if(user._id.toString()!== res.locals.jwtData.id ){
            return res.status(401).send("Permissions didn't match")

        }
        
        user.chats=[];
        await user.save();
        return res.status(200).json({message:"ok"})
    } catch (error) {
        console.log(error)
       throw new ApiError(500,`error :${error.message}`)
        
    }
})