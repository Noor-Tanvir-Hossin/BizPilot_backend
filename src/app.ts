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
import config from './app/config';

const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'https://chatrise-frontend.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(cookieParser())
app.use(helmet())
app.use(express.json())
app.use(express.json())
app.use(mongoSanitize())
if(config.NODE_ENV === "development"){
  app.use(morgan("dev"))
}


app.use("/",express.static('uploads'))
app.use(express.static(path.join(__dirname,"public")))

//application routes
app.use('/api',router)

app.get('/', (req:Request, res:Response) => {
    res.send('Welcome to Chatrise!')
  })


app.use(globalErrorHandler)
app.use(notFound)
  

export default app;