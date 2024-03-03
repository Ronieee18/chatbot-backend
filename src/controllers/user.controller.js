import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import { createToken } from "../utils/tokenManager.js";
import { COOKIE_NAME } from "../constants.js";
export const getAllUsers=asyncHandler(async (req,res)=>{
    try {
        const users=await User.find({})
        console.log(users)
        return res.status(200).json({message:"ok",users})
    } catch (error) {
        throw new ApiError(500,"some error occured")
        
    }
})
export const userSignup=asyncHandler(async (req,res)=>{
    try {
        const {name,email,password}=req.body
        
        if (!name || !email || !password) {
            throw new ApiError(400, "Name, email, and password are required.");
        }
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(401).send("User already registered")
        const hashedPass=await bcrypt.hash(password,10)
        const user=await User.create({name,email,password:hashedPass})
        await user.save();
        //generate token and set cookies
        const expires=new Date();
        expires.setDate(expires.getDate()+7);
        res.clearCookie(COOKIE_NAME,{
            
            path:"/",
            httpOnly:true,
            sameSite: "None",
            signed:true,
        })
        const token=createToken(user._id.toString(),user.email,"7d");
        
        res.cookie(COOKIE_NAME,token,{
            path:"/",
            expires,
            sameSite: "None",
            httpOnly:true,
            signed:true,

        })
        return res.status(201).json({message:"ok",user})
    } catch (error) {
       throw new ApiError(500,`error :${error.message}`)
        
    }
})
export const userLogin=asyncHandler(async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email});
        if(!user)return res.status(401).send("User not found")
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect) return res.status(403).send("Invalid credentials")
        // if (  !email || !password) {
        //     throw new ApiError(400, "Name, email, and password are required.");
        // }
        //generate token and set cookies
        const expires=new Date();
        expires.setDate(expires.getDate()+7);
        res.clearCookie(COOKIE_NAME,{
            path:"/",
            expires,
            sameSite: "None",
            httpOnly:true,
            signed:true,
        })
        const token=createToken(user._id.toString(),user.email,"7d");
        
        res.cookie(COOKIE_NAME,token,{
            path:"/",
            expires,
            httpOnly:true,
            sameSite: "None",
            signed:true,

        })
        return res.status(200).json({message:"ok",user})
    } catch (error) {
       throw new ApiError(500,`error :${error.message}`)
        
    }
})

export const verifyUser=asyncHandler(async (req,res)=>{
    try {
        
        const user=await User.findById(res.locals.jwtData.id);
        if(!user)
            return res.status(401).send("User not registered  or token malfunctioned")
        
        if(user._id.toString()!== res.locals.jwtData.id ){
            return res.status(401).send("Permissions didn't match")

        }
        
        
        return res.status(200).json({message:"ok",user})
    } catch (error) {
        console.log(error)
       throw new ApiError(500,`error :${error.message}`)
        
    }
})
export const logoutUser=asyncHandler(async (req,res)=>{
    try {
        
        const user=await User.findById(res.locals.jwtData.id);
        if(!user)
            return res.status(401).send("User not registered  or token malfunctioned")
        
        if(user._id.toString()!== res.locals.jwtData.id ){
            return res.status(401).send("Permissions didn't match")

        }
        
        res.clearCookie(COOKIE_NAME,{
            path:"/",
            httpOnly:true,
            sameSite: "None",
            signed:true,
        })
        return res.status(200).json({message:"logout successfull"})
    } catch (error) {
        console.log(error)
       throw new ApiError(500,`error :${error.message}`)
        
    }
})