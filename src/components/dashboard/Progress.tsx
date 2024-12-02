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

interface CombinedData {
    category: string;
    usedAmount: number;
    availableAmount: number;
    percentage: number;
    overdraft: boolean;
}

const Progress:React.FC = () => {
    const {email, logout} = useAuth();
    const navigate = useNavigate();
    const [DataUsed, setDataUsed] = useState([])
    const [DataAvail, setDataAvail] = useState([])
    const [combinedData, setCombinedData]= useState<CombinedData[]>([])

    useEffect(()=>{
        getUsedBudget();
        getAvailBudget();
    }, [email, navigate])
    useEffect(() => {
        if (DataUsed.length > 0 && DataAvail.length > 0) {
            combineData();
            console.log("combined data", combinedData)
        }
    }, [DataUsed, DataAvail]);
    
    const getColor =(percentage) =>{
        const norm = Math.min(Math.max(percentage/200, 0),1);
        const r = Math.round(norm*255);
        const b = Math.round((1- norm)*255);
        const g= Math.round((1-Math.abs(norm-0.5)*2)*255)
        return `rgb(${r}, ${g}, ${b})`;
    }

    const handleUserIncomeClick = () => {
        navigate('/user-income'); // Navigate to the UserIncome page
    };
    const handleEditBudgetClick = () => {
        navigate('/budget-category');
    };

    const getUsedBudget =async ()=>{
        console.log("displaying getUsedBudget")
        try{
            const response = await api.post("/display-used-budget-per-category", {email}, {withCredentials:true});
            if(response.status===200){
                setDataUsed(response.data.data)
            }
             else{
             console.log(response)
            }
        }
        catch(error){
            console.log(error)
        }

    }
    const getAvailBudget = async()=>{
        console.log("displaying getUsedBudget")
        try{
            const response = await api.post("/display-budget-per-category", {email}, {withCredentials:true});
            if(response.status===200){
                setDataAvail(response.data.data)
                console.log("avail budget", response.data.data)
            }
             else{
             console.log(response)
            }
        }
        catch(error){
            console.log(error)
        }

    }
    const combineData = () => {
        const data = DataAvail.map((availItem: any) => {
            const usedItem = DataUsed.find((usedItem: any) => usedItem.category === availItem.category);
            const amount = usedItem ? usedItem.amount : 0; 
            const available = availItem.amount;
            const percentage = (amount / available) * 100;
            return {
                category: availItem.category,
                usedAmount: amount,
                availableAmount: available,
                percentage: Math.min(percentage, 200), 
                overdraft: amount > available, 
            };
        });
        setCombinedData(data);
    };
    return(
    <div  className="col-4 bg-light border-end vh-100">
        <div className="row p-3 ml-2" style={{marginLeft: '20px'}}>
            <p className="text-start fw-bold">Track your budget individually</p>
        </div>

        {combinedData.map((item:any)=> (
            <div className="tw-grid tw-grid-cols-[200px_75px_125px_1fr] my-2">
                <div className="tw-justify-self-start tw-pl-2" >{item.category}</div>  
                <div className="">${item.availableAmount}</div>
                <div className="">{item.usedAmount!==0 ? `-$${item.usedAmount}` : 0}</div> 
                
                <div className="">
                    <div className= "progress mb-2">
                        <div className="progress-bar"
                            style={{backgroundColor:`${getColor(item.percentage)}`, 
                            width: item.percentage + '%'}}
                            role="progressbar"
                            aria-valuenow={item.usedAmount}
                            aria-valuemin={0} 
                            aria-valuemax={200}> 
                        </div>
                    </div> 
                </div>  
            </div>
        ))}
        
        <div className="d-flex flex-column align-items-center" >
            <button className="btn btn-primary w-auto mt-5" onClick={handleEditBudgetClick}>Edit Budget</button >
            <button onClick={handleUserIncomeClick} className="btn btn-primary m-4 w-auto">
                Set Income
            </button>
        </div>
    </div>)
}
export default Progress;

