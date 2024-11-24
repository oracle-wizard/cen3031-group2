import * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv"; 

dotenv.config();

export const generateToken = (res, email) => {
    const accessToken = jwt.sign(
        { email },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' } // Access token valid for 15 minutes
    );
    const refreshToken = jwt.sign(
        { email }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '7d' } // Refresh token valid for 7 days
    );
    return { accessToken, refreshToken };
};

export default { generateToken };
