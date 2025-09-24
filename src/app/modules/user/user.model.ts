import { Schema, model } from "mongoose";
import config from "../../config";
import bcrypt from 'bcrypt';
import validator from 'validator'
import { IUserMethods, Tuser } from "./user.interface";
import { boolean } from "zod";
import { Model } from "mongoose";

export type UserModel = Model<Tuser, {}, IUserMethods>;

const userSchema = new Schema<Tuser, UserModel, IUserMethods>({
    name:{
        type:String,
        required:[true, "Please add your name"],
        unique:true,
        trim:true,
        minlength:3,
        maxlength:30,
        index:true
    },
    email: {
        type:String,
        required:[true, "Please provide email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, "Please provide a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please provide password"],
        minlength:8,
        select:false
    },
    passwordChangeAt:{
        type:Date
        
    },
    profilePicture:{
        type:String,
        default: ''
    },
    
    isVarified:{
        type:Boolean,
        default:null
    },
    otp:{
        type:String,
        default:null,
    },
    otpExpires:{
        type:Date,
        default:null,
    },
    resetPasswordOtp:{
        type:String,
        default:null
    },
    resetPasswordOtpExpires:{
        type:Date,
        default:null
    },
},{
    timestamps:true
})

userSchema.pre('save', async function(next){
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const user= this
    // user.password= await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds))
    // next()

    if (!this.isModified('password')) return next();
    if (!this.password) {
      console.error("Password is undefined before hashing");
      return next(new Error("Password is required"));
    }
    
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
    next();
  
  })

  userSchema.methods.correctPassword= async function( userpassword:string, databasePassword:string){
    return await bcrypt.compare(userpassword,databasePassword)
  }

  export const User= model<Tuser, UserModel>('User', userSchema)
