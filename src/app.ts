import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path'
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import notFound from './app/utils/notFound';
import globalErrorHandler from './app/utils/globalErrorHandler';
import router from './app/routes';
import exp from 'constants';
import config from './app/config';

const app = express()
app.use("/",express.static('uploads'))
app.use(cookieParser())
app.use(helmet())
app.use(express.json())

//application routes
app.use('/api',router)
app.use(
  cors({
    origin:["https://localhost:3000"],
    credentials:true
  })
)
app.use(express.static(path.join(__dirname,"public")))


app.get('/', (req:Request, res:Response) => {
    res.send('Welcome to Chatrise!')
  })

if(config.NODE_ENV === "development"){
  app.use(morgan("dev"))
}

app.use(express.json({limit:"10kb"}))
app.use(mongoSanitize())

app.use(globalErrorHandler)
app.use(notFound)
  

export default app;