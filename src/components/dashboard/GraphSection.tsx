import  api  from "../../axiosInstance";
import { useAuth } from '../../../server/src/context/authContext'

// import 'bootstrap/dist/css/bootstrap.min.css';
import { Line} from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { color } from "chart.js/helpers";
import { MdBorderColor } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState} from "react";
interface Graph{
    amount: Number,
    month: Number,
    year: Number
}
const GraphSection:React.FC = () => {

    const email = useAuth()
    const [ExpGraphData, setExpGraphData] = useState<Graph[]>([])
   // const [GraphData, setGraphData] = useState<Graph[]>([])

    const navigate =useNavigate();
    useEffect(()=>{
        displayExpenses();
        //displayIncome();

    }, [email, navigate])

    const displayExpenses= async()=>{
        try{
         const response = await api.post('/get-expenses-graph',
             {email}, {withCredentials:true} )
         if(response.status===200){
            const data = response.data.expenses;
     
            const transformedData  = data.map((row: [number, number, number])=>({
                amount: row[0],
                month: row[2], 
                year:row[1]
            }));      
            const sortedData = transformedData.sort((a, b)=>{
                if(a.year!=b.year){
                    return a.year-b.year
                }
                return a.month - b.month
            })

            setExpGraphData(sortedData);
           // console.log('ExpGraphData', ExpGraphData);
            
         }
        } 

        catch(err){
             console.log(err)
        }
     }
    /* const displayIncome = async ()=>{
        try{
            const response = await api.post('/get-income-graph',
                {email}, {withCredentials:true} )
            if(response.status===200){
               const data = response.data.income;
               const transformedData  = data.map((row: [number, number, number])=>({
                   amount: row[0],
                   month: row[2], 
                   year:row[1]
               }));      
               const sortedData = transformedData.sort((a, b)=>{
                   if(a.year!=b.year){
                       return a.year-b.year
                   }
                   return a.month - b.month
               })

                  const expensesMerged = ExpGraphData.map((item:any)=>{
                
                    const income = sortedData.find((itemS:any)=> {itemS.month === item.month && itemS.year === item.year });
                    const incomeAmount = income ? income.amount : 0;
                    return{
                        month: item.month,
                        year: item.year,
                        expenseAmount: item.amount,
                        incomeAmount:incomeAmount
                        

                    }
               })
            const merged = expensesMerged.map((item:any)=>{
                
                const income = sortedData.find((itemS:any)=> {itemS.month === item.month && itemS.year === item.year });
                const incomeAmount = income ? income.amount : 0;
                return{
                    month: item.month,
                    year: item.year,
                    expenseAmount: item.amount,
                    incomeAmount:incomeAmount
                    

                }
           })

               console.log("new data",sortedData)

               setGraphData(sortedData);
               console.log('GraphData', GraphData);
            }
            else{
                console.log(response)
            }
           } 
   
           catch(err){
                console.log(err)
           }
     }
*/
    const data = {
        labels:ExpGraphData.map((item)=>`${item.month}-${item.year}`),
        datasets:[{
            label:'Expenses',
            borderWidth: 2,  
            data:ExpGraphData.map((item)=>item.amount), 
            fill:false
        },
    ]
    }
 
    const option2={
       plugins:{
            legend:{
                position:'top', 
                align:'end',
                labels:{
                    color:'black', 
                    boxWidth: 20,
                    usePointStyle: true,
                    backgroundColor: 'Green'
                    },
                },
            },
    
        }
    return(      
        <div className="col-12 border p-3 fw-bold " style={{height:'60vh'}}>See your total income and spending trends in one place
        <div className="row"></div>
            <div>
            <Line data={data} options={option2}></Line>
            </div>
        </div>)

}
export default GraphSection;

