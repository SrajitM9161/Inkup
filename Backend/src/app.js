import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import helmet from "helmet"
import dotenv from "dotenv"
dotenv.config();
const app= express();

app.use(cors({
   origin:process.env.CORS_ORIGIN,
   credentials:true
}))
app.use(helmet());
app.use(express.json({limit:"25mb"}))
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.static("Public"))
app.use(cookieparser())

app.get("/",(req,res)=>{
      res.send("Welcome to the backend server");
   })

export default app;   




