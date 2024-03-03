import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import router from './routes/index.js';
import cors from 'cors'


const app=express();
app.use(cors({origin:"https://mychatbott.netlify.app",credentials:true}))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan("dev"))


app.use('/api/v1',router)

export {app}