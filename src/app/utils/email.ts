import nodemailer from 'nodemailer'
import config from '../config';

interface EmailOptions {
    email: string;
    subject: string;
    html: string;
  }

export const sendEmail =async(options:EmailOptions) =>{
    const transporter = nodemailer.createTransport({
        service : "Gmail",
    auth:{
        user: config.email,
        pass:config.email_pass
    }
});

const mailOptions = {
    form: "'BizPlot' share your imaginaiton",
    to: options.email,
    subject:options.subject,
    html:options.html
}
 
await transporter.sendMail(mailOptions)
}