import { Request, Response } from "express";
import {authToken} from '../middleware/authenticateToken'

export const  addBudget= async  (req, res) =>{
    const budget = req.body;
    console.log(budget)
}
export default {addBudget};