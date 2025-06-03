import express, { Request, Response } from 'express';
import cors from 'cors';
import { bookRoutes } from './app/modules/book/book.route';
import notFound from './app/utils/notFound';
import globalErrorHandler from './app/utils/globalErrorHandler';
import { orderRoutes } from './app/modules/order/order.route';

const app = express()


app.use(express.json())
app.use(cors())

//application routes
// app.use('/api',router)
app.use("/api/products", bookRoutes);
app.use("/api/orders", orderRoutes);


app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!')
  })

  app.use(globalErrorHandler)
  app.use(notFound)
  

export default app;