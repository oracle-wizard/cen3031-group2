import * as jwt from 'jsonwebtoken'
import * as dotenv from "dotenv"; 

dotenv.config()

export const refreshToken = async (req , res) =>{
    const {refreshToken}  = req.cookies;
    if(! refreshToken) {
      console.log("No refresh token provided")
      return res.status(401);
    }
    try{
      const user = jwt.verify(req.cookies.refreshToken, process.env.JWT_SECRET as string);
      if(!user) {
        return res.status(401).json({error: "Invalid refresh token"})
      }
      const accessToken = jwt.sign({email: user}, process.env.JWT_SECRET as string, {'expiresIn': '10m'});
      console.log(`New token has been generated ${accessToken}`)
      res.json({token: accessToken})
    }
    catch(error){
      console.log("Generating a refresh token failed.")
      console.log(error);
      res.status(500).json({ error: "Login failed." });
    }
  };

export default {refreshToken}