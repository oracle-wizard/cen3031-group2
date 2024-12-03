import  api  from "../../axiosInstance";
import { useAuth } from '../../../server/src/context/authContext'

// import 'bootstrap/dist/css/bootstrap.min.css';
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
    const [AvgSpending, setAvgSpending] = useState("");

    useEffect(()=>{
        if(email){
            displayBudget();
            displayExpenses();
            getBudget();
            getAvgSpending();
        }
    }, [email, navigate])

    const getAvgSpending = async () => {
        console.log("trying to fetch budget info")
        try{
            const response = await api.post("/get-avg-spending", {email});
        if(response.status===200){
             const {spending} = response.data;
            console.log(spending)
            setAvgSpending(spending)
             }
        if(response.status===400){
        console.log("not found")
         }
    }
    catch(err){
        console.log("error: ", err)
     
    }
    }

    const displayBudget = async () => {
        console.log("trying to fetch budget info")
        try{
            const response = await api.post("/display-budget", {email});
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
            const response = await api.post("/get-total-expenses", {email});
            if(response.status===200){
               console.log("get total expenses", response.data.expenses)
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
        try{
            const response = await api.post("/get-budget", {email});

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
        </div>
     );
}
export default Stats;
