
import { Request, Response } from "express";
import { execute } from '../database';
import { generateToken } from "./generateToken";
import * as bcrypt from 'bcrypt'
import generateAndSend from "../middleware/sendEmail";
import { refreshToken } from "./refreshTokenController";
interface User{
  firstName: string,
  lastName: string,
  email: string; 

  password: string
}

export const register = async ( req, res)  => {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO "C.SMELTZER".USERS (first_name, last_name, email, password)
      VALUES (:firstName, :lastName, :email, :hashedPassword)`;
  
    try {
      await execute(query, { firstName, lastName, email, hashedPassword });
      const {accessToken, refreshToken} = generateToken(res, email);
      console.log(`refresh token ${refreshToken}`)
      res.cookie('refreshToken', refreshToken, 
        {httpOnly:true, 
         sameSite: 'strict',
         maxAge: 60*60*1000
       }
     )      
     res.status(200).json({accessToken})
    } 
    catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  };

export const login = async(req, res) =>{
    const {email, password} = req.body;
    try{
      const query = `SELECT * FROM "C.SMELTZER".users WHERE email= :email`; 
      const result = await execute(query, {email});
      if(result.rows.length==0)
        return res.status(401).json({error: 'Invalid credentials'})
      
      const user = result.rows[0] as User; 
      const userPassword = user[3]; //password
      const userEmail = user[2];
      console.log(userPassword)
      if(!userEmail){
        return res.status(401).json({error: 'Invalid email'})
      }
      const passwordMatch = await bcrypt.compare(password, userPassword) 
      if(!passwordMatch){
        return res.status(401).json({error: 'Invalid password'});
      }
      const {accessToken, refreshToken} = generateToken(res, email);
      console.log(`refreshToken ${refreshToken}`)
      res.cookie('refreshToken', refreshToken, 
        {
          httpOnly:false, 
          secure: false,
          sameSite:'Lax',
          domain: 'localhost',
          path: '/',
          maxAge: 10*60*1000
       }
    )      
    res.status(200).json({accessToken})
    }
    catch(error){
      console.log(error)
      res.status(500).json({error: "Login failed"})
      }
    };

export const logout  = async(req: Request, res: Response) =>{
    res.clearCookie('refreshToken', {
      path: '/', 
      domain: 'localhost', 
      sameSite: 'lax', 
      secure: false //need to change later
    })
    res.sendStatus(200);
}
export const resetPassword = async(req: Request, res: Response)=>{
  const email = req.body.email;
  if(!email){
    res.status(400).json('Email is required.');
    return;
  }
  try{
      await generateAndSend(email);
      res.sendStatus(200)
      console.log("sendind status 200..")}

  catch(err){
    res.status(500).json('An error occured while sending the verification code.');
  }


}
export const verifyCode = async(req: Request, res: Response)=>{

  const code = req.body.code;
  const email  =req.body.email;

  if(!email)
    res.sendStatus(400);

  const query = 'SELECT code, createdAt FROM tempcodes WHERE email = :email';
  console.log(email)
  console.log(code);

  try{ 
    const response = await execute(query, {email: req.body.email});
    if(response.rows && response.rows.length>0 ){
      const user = response.rows[0];

      if(parseInt(code)===user[0]){
        const expiryTime = 10*60*1000;
        const currentTime = new Date().getTime();
        const codeAge = currentTime - new Date(user[1]).getTime();
        if(codeAge<=expiryTime){
          res.sendStatus(200);
        }else{
          res.sendStatus(400);
        }
      }
      else{
        res.sendStatus(400)
        console.log("No code provided in the request")
      }
    }
    else{
      res.sendStatus(400)
    }
  }
  catch(err){
    res.sendStatus(500)
  }

}
export const setNewPassword = async(req, res)=>{
    if(!req.body.password || !req.body.email){
      res.sendStatus(400);
      console.log(" no req body info ")
      return;
    }
    console.log("attempting to set a new password..")
  const email  = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const query = 'UPDATE "C.SMELTZER".USERS SET password = :hashedPassword WHERE email= :email';
  try{
    await execute(query, {hashedPassword, email});
    console.log("successfully ecexuted the query")
    const {accessToken, refreshToken} = generateToken(res, email);
      console.log(`refresh token ${refreshToken}`)
      res.cookie('refreshToken', refreshToken, 
        {httpOnly:true, 
         sameSite: 'strict',
         maxAge: 60*60*1000
       }
     )      
     res.status(201).json({accessToken})

  }catch(err){
    res.sendStatus(500);
  }

}
export default {register, login, logout, verifyCode, setNewPassword};
