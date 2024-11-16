// middleware/authToken.ts
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

// Extend Express's Request interface to include `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: { email: string };  // Add user property with email
  }
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.sendStatus(403);  // Forbidden
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {        
    res.sendStatus(403);  // Forbidden
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedToken) => {
    if (err) {
      console.log("status code 403");
      res.sendStatus(403);
      return; 
    }

    // Explicitly set only the email from the decoded token
    const email = (decodedToken as any).email;
    req.user = { email };  // Attach only the email to req.user
    next();
  });
};

export default authToken;