import dotenv from 'dotenv'
import 'dotenv/config'
import path from 'path'

dotenv.config({path: path.join((process.cwd() , '.env'))})

export default{
    NODE_ENV:process.env.NODE_ENV,
    port:process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_token:process.env.JWT_ACCESS_TOKEN as string,
    jwt_refresh_token:process.env.JWT_REFRESH_TOKEN as string,
    jwt_access_token_exprires_in:process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1d',
    jwt_refresh_token_exprires_in:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '365d',
    email:process.env.EMAIL,
    email_pass:process.env.EMAIL_PASS
    
}