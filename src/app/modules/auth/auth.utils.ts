import jwt from 'jsonwebtoken';
import config from '../../config';
import * as fs from 'fs';
import { Response } from 'express';
import path from 'path';
import hbs from 'handlebars';

   

export const signToken =(id: string)  : string=>{
    return jwt.sign({id},config.jwt_access_token as string ,{
        expiresIn: '1h' 
    })
}

interface IUser {
    _id: string;
    password:string | undefined;
    otp:string | undefined
  }

export const createToken = (user : IUser, StatusCodes:number, res:Response, message:string)=>{
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + parseInt(config.jwt_access_token_exprires_in || '1')  * 24*60*60*1000
        ),
        httpOnly : true,
        secure:config.NODE_ENV === 'production',
        sameSite : (config.NODE_ENV === 'production' ? "none" : "lax") as
        | 'none'
        | 'lax'
        | 'strict'
        | boolean
    };
    res.cookie("AccessToken", token, cookieOptions);
    user.password = undefined,
    user.otp=undefined
    res.status(StatusCodes).json({
        success: true,
        message,
        data: {
          user,
          token,
        },
      });

}



export const loadTemplate = (templateName : string, replacements: Record<string, string|number | boolean>) =>{
    const templatePath = path.join(__dirname, "../../emailTemplate", templateName);
    const source = fs.readFileSync(templatePath, "utf-8");
    const template = hbs.compile(source)
    return template(replacements)
}
