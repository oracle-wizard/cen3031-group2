import { Request, Response } from "express";
import {authToken} from '../middleware/authenticateToken'
import { execute } from '../database';
import { Interface } from "readline";
import { getExpenses } from "./expenseController";
import Month from "react-datepicker/dist/month";

import * as oracledb  from 'oracledb';


export const  addBudget= async  (req: Request, res: Response) =>{
    const budget = req.body;
    console.log(budget)
}
export const displayBudget = async(req: Request, res: Response) =>{
    const email = req.body.email;
    if(!email){
        res.sendStatus(400);
        return;
    }
    try{
        //getting current month income and balance
        const query = `SELECT * FROM "C.SMELTZER".money WHERE created_date BETWEEN TRUNC(SYSDATE, 'MM') AND LAST_DAY(SYSDATE) AND email =:EMAIL`;
        const binds = {
            EMAIL: { val: email } // Use `val` to specify the value
        };
        const result = await execute(query, binds);
        if(!result.rows || result.rows.length===0){
            res.status(404).send("No budget data found for the current month.");
            return;
        }
        const values = result.rows[0] as any
      //console.log("result", values[2])
        //getting total income 
      //  const queryTotal = `SELECT total_income from "C.SMELTZER".money WHERE email =: EMAIL`
       // const result2 = await execute(queryTotal, binds);
       // if(!result2.rows || result.rows.length===0){
        //    res.status(403).send("No budget data found for this user.");
      //  }
       res.json({totalIncome: values[2], balance: values[3]})
    }
    catch(error){
        console.log("Error in displayBudget", error)
    }
  

}
export const getExpensesTotal = async (req: Request, res: Response)=>{
    const email = req.body.email;
    if(!email){
        res.sendStatus(404);
        return;
    }
    try{
        const query = `SELECT SUM(expense_amount) 
                    FROM "C.SMELTZER".expense 
                    WHERE email =:EMAIL AND expense_date 
                    BETWEEN TRUNC(SYSDATE, 'MM' ) AND LAST_DAY(SYSDATE)`
        const result = await execute(query, {EMAIL :{ val: email }});
        if(!result.rows || result.rows.length ===0 || result.rows[0]===null){
            res.status(404).send("No expenses found for this user.");
            return;
        }
        res.status(200).json({expenses: result.rows[0]}) 

    }
    catch(error){
        console.log("error in expenses",error)
        res.sendStatus(500)
    }
}
export const  getExpensesCategories =async (req: Request, res: Response) =>{
   try{
        const email = req.body.email;
        const query = `
            SELECT 
            b."CATEGORY_NAME",
            SUM(e."EXPENSE_AMOUNT")
            FROM "C.SMELTZER"."EXPENSE" e
            JOIN "C.SMELTZER"."BUDGETCATEGORY" b
            ON e."CATEGORY_ID" = b."CATEGORY_ID"
            WHERE e.email =: EMAIL
            GROUP BY b."CATEGORY_NAME"`;

        const result = await execute(query, email);
        if(!result.rows || result.rows.length===0){
            res.sendStatus(404);
            return;
        }
        const data = result.rows?.map((row:any)=>({category: row[0], amount: row[1]}))
        res.status(200).json({data})
   }
   catch(error){
        console.log("error in catExp:",error);
        res.sendStatus(500);

   }

}

export const UsedBudgetPerCat =async (req: Request, res: Response)=>{
    try{
        const email = req.body.email;
        const query = `
        SELECT SUM(e.expense_amount), 
        b.category_name
        FROM "C.SMELTZER"."EXPENSE" e
        JOIN "C.SMELTZER"."BUDGETCATEGORY" b
        ON e."CATEGORY_ID" = b."CATEGORY_ID"
        WHERE e."EMAIL" =:email
        GROUP BY category_name `;
        const result = await execute(query, { email:{ val: email} });
        if(!result.rows || result.rows.length===0)
        {
            res.sendStatus(404);
            return;
        }
        const data = result.rows?.map((row:any) =>({category: row[1], amount: row[0]}))
        res.status(200).json({data});

    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }

}
export const dispBudgetPerCategory =async (req: Request, res: Response)=>{
    try{
        console.log("displaying available budget per category")
        const email = req.body.email;
        const query = `
        SELECT allocated_amount, category_name 
        FROM "C.SMELTZER"."BUDGETCATEGORY" 
        WHERE "EMAIL" =:email
    `;
        const result = await execute(query, { email:{ val: email} });
        if(!result.rows || result.rows.length===0)
        {
            res.sendStatus(404);
            return;
        }
        const data = result.rows?.map((row:any) =>({category: row[1], amount: row[0]}))
        console.log(result.rows)
        res.status(200).json({data});

    
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }


}

export const getBudget = async (req: Request, res: Response)=>{
    try{
        const email = req.body.email;
        const query = `
        SELECT SUM(allocated_amount)
        FROM "C.SMELTZER"."BUDGETCATEGORY" 
        WHERE "EMAIL" =:email` ; 
        const result = await execute(query, { email:{ val: email} });
        if(!result.rows || result.rows.length ===0){
            res.sendStatus(404);
        }
        const value = result.rows[0] as any
        res.status(200).json({budget: value[0]})
    
    }
    catch(err){
        console.log("budget:",err)
        res.sendStatus(500)
    }


}

export const getExpensesGraph =async (req: Request, res: Response)=>{
    try{
        const email = req.body.email;
        const query = `
        SELECT SUM(expense_amount), 
        EXTRACT(YEAR FROM expense_date), 
        EXTRACT(MONTH FROM expense_date)
        FROM "C.SMELTZER".expense 
        WHERE "EMAIL" =:email
        GROUP BY 
            EXTRACT(YEAR FROM expense_date), 
            EXTRACT(MONTH FROM expense_date)`; 
        const result = await execute(query, email);
        if(!result.rows || result.rows.length ===0){
            res.sendStatus(404);
            return;
        }
        console.log("getExpensesGraph", result.rows)
        res.status(200).json({expenses: result.rows});
    
    }
    catch(err){
        console.log("getExpensesGraph error:",err);
        res.sendStatus(500);
    }
}

export const getIncomeGraph = async (req: Request, res: Response)=>{
    try{
        const email = req.body.email;
        const query = `
        SELECT SUM(total_income), 
        EXTRACT(YEAR FROM created_date), 
        EXTRACT(MONTH FROM created_date)
        FROM "C.SMELTZER".money 
        WHERE "EMAIL" =:email
        GROUP BY 
            EXTRACT(YEAR FROM created_date), 
            EXTRACT(MONTH FROM created_date)`; 
        const result = await execute(query, email);
        if(!result.rows || result.rows.length ===0){
            res.status(404).json({message: 'No income found for this user.'});
            return;
        }
        console.log("getIncomeGraph", result.rows)
        res.status(200).json({income: result.rows});
    
    }
    catch(err){
        console.log("getExpensesGraph error:",err);
        res.sendStatus(500);
    }
}
export default {addBudget, displayBudget,getExpensesTotal, UsedBudgetPerCat, dispBudgetPerCategory, getExpensesGraph};



/*
const date = req.body.date;
const [year, month] = date.split('-');
const startDate = `${year}-${month}-01`;  
const endDate = `${year}-${month}-30`;   
const startOracle = new Date(startDate)
const endOracle = new Date(endDate)
// Format the dates to 'DD-MON-YY' format that Oracle understands
const formatDate = (date: Date) => {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];

    const year = date.getFullYear().toString().slice(2); // Extract last 2 digits of the year
    return `${year}-${date.getMonth().toString().padStart(2, '0')}-${day}`;
  };

  const startFormatted = formatDate(startOracle);
  const endFormatted = formatDate(endOracle);
  
console.log('in getExpensesCat', email)
console.log("startFormatted", startFormatted)
console.log("endFormatted", endFormatted)
const binds = {
        EMAIL: { val: email },
        STARTDATE: { val: startFormatted, type: oracledb.STRING, dir: oracledb.BIND_OUT},
        ENDDATE: { val: endFormatted, type: oracledb.STRING, dir: oracledb.BIND_OUT }
      };*/
      //        AND expense_date BETWEEN TO_DATE(:STARTDATE, 'DD-MON-YY') AND TO_DATE(:ENDDATE, 'DD-MON-YY')
