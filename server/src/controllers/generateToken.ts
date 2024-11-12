
import * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv"; 
import * as bcrypt from 'bcrypt'

dotenv.config();

export const generateToken  = (res, email)=>{
    const accessToken = jwt.sign({email},
        process.env.JWT_SECRET as string, {'expiresIn': '1m'} );
    const refreshToken = jwt.sign({email}, 
        process.env.JWT_SECRET as string, {'expiresIn': '5m'});
    return {accessToken, refreshToken}
}
export default {generateToken}