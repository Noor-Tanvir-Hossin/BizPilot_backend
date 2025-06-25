

import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';



const notFound: RequestHandler = (_req, res, _next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Can't find ${_req.originalUrl} on this server!`,
    error: '',
  });
};


export default notFound;