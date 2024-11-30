import  api  from "../../axiosInstance";
import { useAuth } from '../../../server/src/context/authContext'

import 'bootstrap/dist/css/bootstrap.min.css';
import { Line} from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { color } from "chart.js/helpers";
import { MdBorderColor } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState} from "react";
const GraphSection:React.FC = () => {
    const email = useAuth()
    const [GraphData, setGraphData] = useState([])

    const navigate =useNavigate();
    useEffect(()=>{
        displayGraph()

    }, [email, navigate])

    const displayGraph= async()=>{
        try{
         const response = await api.post('/get-expenses-graph',
             {email}, {withCredentials:true} )
         if(response.status===200){
            setGraphData(response.data.data);
         }
        } 

        catch(err){
             console.log(err)
        }
     }




    const data = {
        labels: ['January', 'February', 'March', 'April', "May", "June", "July", "August"], 
        datasets:[{
            label:'Expenses', backgroundColor: 'red', borderColor: 'red',
            data:[3450, 1900, 5443, 6455, 2432, 4994, 9009, 2994, 4324, 2324, 4002 ]
        }, 
        {label:'Income', backgroundColor: 'green', borderColor: 'green',
            data:[12300, 10030, 7599,8003, 8045, 9045, 5060, 5883, 10044]
        }
    ]
    }
    const option2={
        plugins:{
            legend:{
                position:'top', 
                align: 'end'
            }
        }
    }
    return(      
        <div className="col-12 border p-3 fw-bold " style={{height:'60vh'}}>See your total income and spending trends in one place
        <div className="row"><div className="col-2 text-end"><input type="date" className="form-control ml-auto col-3 text-end"></input></div></div>
            <div>
                <Line data={data} options={option2}></Line>
            </div>
        </div>)

}
export default GraphSection;

