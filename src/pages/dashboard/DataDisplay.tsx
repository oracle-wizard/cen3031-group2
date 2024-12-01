import  api  from "../../axiosInstance";
import { useAuth } from '../../../server/src/context/authContext'

import 'bootstrap/dist/css/bootstrap.min.css';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { color } from "chart.js/helpers";
import { MdBorderColor } from "react-icons/md";

import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const Stats : React.FC = ()=>{
    const {email, logout} = useAuth();
    const navigate = useNavigate();
    const [totalIncome, setTotalIncome] = useState<number | null>(null);
    const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
    const [totalSavings, setTotalSavings] = useState<number | null>(null);
    const [error, setError] = useState<string>("");
    const [balance, setBalance] = useState("");
    const [expenses, setExpenses] = useState("");
    const [budget, setBudget] = useState("");

    useEffect(()=>{
        if(email){
            displayBudget();
            displayExpenses();
            getBudget();
        }
    }, [email, navigate])



    const displayBudget = async () => {
        console.log("trying to fetch budget info")
        try{
            const response = await api.post("/display-budget", {email}, {withCredentials:true});
        if(response.status===200){
        const {totalIncome, balance} = response.data;
       // console.log(totalIncome)
        setTotalIncome(totalIncome);
        setBalance(balance);
             }
        if(response.status===400){
        console.log("not found")
         }
    }
    catch(err){
        console.log("error: ", err)
     
    }
    }
    const displayExpenses = async()=>{
        console.log("displaying expenses")
        try{
            const response = await api.post("/get-expenses", {email});
            if(response.status===200){
              //  console.log(response.data.expenses)
                setExpenses(response.data.expenses)
            }
            else{
                console.log(response)
            }
        }
        catch(err){
            console.log(err);

        }
    }

    const getBudget = async() =>{
        const response = await api.post("/get-budget", {email});
        
        try{
            if(response.status===200){
                setBudget(response.data.budget);
            }
            else{
                console.log(response)
            }
        }
            
        catch(err){
            console.log(err);
    
        }
    }
    

    


    return(
        <div className="col-12 border p-3 mb-3" style={{height:'30vh'}}>
        <div className="row">
        <div className ="col-6 text-start fw-bold">
        {new Date(Date.now()).toLocaleString('default', { day: 'numeric',month:'long', year:"numeric"})}
         </div>
        </div>
        <div className="font-weight-bold fw-bold fs-4"
            style={{color:"#009df7"}}>Current Balance</div>
        <div className="font-weight-bold p fs-4 fw-bold">${budget-expenses}</div>
        <div  className="row">
        <div className="col-4 mt-3 fw-bold fs-5">Total Income</div>
        <div className="col-4 mt-3 fw-bold fs-5" >Expenses</div>
        <div className="col-4 mt-3 fw-bold fs-5">Budget</div>
        </div>
        <div  className="row">
        <div className="col-4 p-1 fs-5">${totalIncome}</div>
        <div className="col-4 p-1 fs-5"  style={{color:"red"}}>-${expenses}</div>
        <div className="col-4 p-1 fs-5">${budget}</div>
        </div>
        <div  className="row">
        
        <div className="col-4 mt-3 fw-bold d-flex justify-content-center align-items-center">
        Average Spending</div>
        </div>

        <div  className="row">
        <div className="col-4 p-1">$5000</div>
        </div>


    </div>
   
     );
}
export default Stats;