import  api  from "../../axiosInstance";
import { useAuth } from '../../../server/src/context/authContext'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import 'bootstrap/dist/css/bootstrap.min.css';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { color } from "chart.js/helpers";
import { MdBorderColor } from "react-icons/md";

import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tooltip } from "chart.js/auto";

const PieSection:React.FC = ()=>{
    const email = useAuth()
    const navigate =useNavigate();
    const handleExpenseTrackerClick = () => {
        navigate('/expense-tracker');
    };
   const [selectedDate, setSelectedDate] =useState<Date | null>(null);
    useEffect(()=>{
        displayExpenses()
    }, [email, navigate])
    const [ChartData, setChartData] = useState([])

    const displayExpenses= async()=>{
       try{
        //const date = `${selectedDate?.getFullYear()}-${(selectedDate?.getMonth()+1).toString().padStart(2, "0")}`
       // console.log("date in getexpenses",date)

        const response = await api.post('/get-expenses-categories',
            {email}, {withCredentials:true} )
        if(response.status===200){
            const data = response.data.data;
            const chart = {labels:data[0], values : data[1]}
            setChartData(response.data.data);

        }else{

        }
       } 
       catch(err){
            console.log(err)
       }
    }
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
     //   if (date) {
       //   console.log("Selected Date:", date);
       // }
        displayExpenses()
      };
      const data ={
        labels: ChartData.map((item:any)=>item.category),
        datasets:[
            {
                data: ChartData.map((item:any)=>item.amount),
                backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6",
                    "#33A6FF", "#A633FF", "#FF5733", "#FF6347", "#FF4500",
                    "#FFD700", "#32CD32", "#8A2BE2", "#7FFF00", "#D2691E",
                    "#FF1493", "#8B0000", "#FF8C00", "#ADFF2F", "#00FFFF"
                ],
                hoverBackgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6"]
            }
    
        ]
      };
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom', 
            labels: {
              boxWidth: 20, 
              padding: 15,   
              font: {
                size: 14,    
              },
            },
          },
          tooltip: {
            enabled: true, 
            callbacks: {
              label: (tooltipItem: any) => {
                return `${tooltipItem.label}: $${tooltipItem.raw}`;  
              },
            },
          },
        },
        layout: {
          padding: {
            bottom: 40, 
          },
        },
      };
    return(         
        <div className ="col-3 bg-light border-start vh-100">
        <div className="fw-bold"><p>Your spending habits visualized</p>
        <div className="row"><div className="col-5" style={{position:"absolute", right:'0', maxWidth: 160, marginBottom:80}}>
        <div><DatePicker dateFormat="MMMM yyyy"
         selected={selectedDate}
         onChange={handleDateChange}
        showMonthYearPicker
        showFullMonthYearPicker
        selectsStart
        showPopperArrow={false}
                /></div>
                </div></div>
        <div className="col-12 mt-5"><Pie data={data} options={options} />   </div></div>
      
        <button className="btn btn-primary m-5" onClick={handleExpenseTrackerClick}>Expense Tracker</button>
    </div>)
}

export default PieSection;