const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
import {execute} from '../database'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure:false,
    auth:{
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    }, 
    debug:true}
)

export const sendVerificationEmail= async (toEmail: String, verificationCode: Number)=>{
    const mailOptions ={
        from: process.env.EMAIL_USER, 
        to: toEmail, 
        subject: 'Your Verification Code', 
        text: `<p>Your Verification code is: <strong> ${verificationCode}</strong></p>`,
        html:`Your Verification code is:  ${verificationCode}`,
    }
    try{
        const info  = await transporter.sendMail(mailOptions)
            console.log('Email sent successfully', info.response)

        }
    catch(err){
        console.log('Error sending email: ', err)
        return;
    }
}

export const generateAndSend =async (email:String)=>{
    const verificationCode = Math.floor(1000000+ Math.random() *900000); //6 digits code
    try{
        await sendVerificationEmail(email, verificationCode);
        console.log('Verification email sent');}
    catch(err){
        console.log(err)
    }
    const currentDate = new Date();
   try{
        const checkQuery = 'SELECT COUNT(*) FROM "ALIASHYNSKA".tempcodes WHERE email = :email';
        const result= await execute(checkQuery, {email});
        console.log("searching..")
        if(result.rows && result.rows[0][0] > 0){
            const deleteQuery = 'DELETE FROM "ALIASHYNSKA".tempcodes WHERE email = :email ';
            console.log("deleting...")
            await execute(deleteQuery,{email})
        }
        const query = 'INSERT INTO "ALIASHYNSKA".tempcodes(email, code, createdAt) VALUES(:email, :verificationCode, :currentDate)'
       await execute(query, {email, verificationCode, currentDate});
       console.log("successfully inserted")
    }
    catch(err){
        console.log(err);
        throw new Error('Failed to insert a verification code into database')
    }
}
export default generateAndSend;