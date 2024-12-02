import { AxiosInstance } from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { color } from "chart.js/helpers";
import { MdBorderColor } from "react-icons/md";


const Dashboard:React.FC = () =>{
    const budget = [
        { id: 1, name: "Groceries", amount : 1324, percentage: 25 },
    { id: 2, name: "Entertainment", amount : 12, percentage: 50 },
    { id: 3, name: "Utilities",  amount : 343,percentage: 100 },
    { id: 4, name: "Dining", amount : 255, percentage: 80 },
    {id:5, name:"Travel",  amount : 800,percentage:200},
    {id:6, name:"Housing",  amount : 200,percentage:150}

    ]
    const getColor =(percentage) =>{
        const norm = Math.min(Math.max(percentage/200, 0),1);
        const r = Math.round(norm*255);
        const b = Math.round((1- norm)*255);
        const g= Math.round((1-Math.abs(norm-0.5)*2)*255)
        return `rgb(${r}, ${g}, ${b})`;
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
    const data2 = {
        labels: ['Entertainment', 'Utilities', 'Dining', 'Travel', 'Education', 'Bills', 'Personal'],
        datasets:[{
            label:'Sales', 
            data:[2004, 234, 994, 500, 244, 533], 
            backgroundColor: [
                '#FF6384', // Entertainment
                '#36A2EB', // Utilities
                '#FFCE56', // Dining
                '#4BC0C0', // Travel
                '#FF9F40', // Education
                '#9966FF', // Bills
                '#FF6347'  // Personal
            ]
        }]
    }
    const options = {
        plugins:{
            legend:{
                position: 'bottom', 
                align:'start',
                labels:{
                    boxWidth:15, 
                    padding: 10, 
                    font:{
                        size: 14,
                    }

                }
            }
        },
        datalabels:{
            color: '#fff'

        }
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

       <div className="container-fluid" style={{width:'100vw' , maxWidth:'none'}}>
            <div className="row p-4"></div>
            <div className="row">
            <div  className="col-3 bg-light border-end vh-100">
            <div className="row p-3">
                <p className="text-start fw-bold">Track your budget individually</p></div>
                {budget.map((item)=> (
                    <div  key={item.id} className="row">
                        <div className="col-5 mb-2 text-start ms-1 d-flex justify-content-between"><span >{item.name}</span>  <span className=" text-end" style={{fontWeight:'lighter'}}>{item.amount}</span></div>
                        
                        <div className="col-6">
                            <div className= "progress mb-2">
                            <div className="progress-bar"
                                style={{backgroundColor:`${getColor(item.percentage)}`, width: item.percentage}}
                                role="progressbar"
                                aria-valuenow={item.percentage}
                                aria-valuemin={0} 
                                aria-valuemax={200}>
                                </div>
                             </div>
                        </div>
                    </div>))}
                    <button className="btn btn-primary m-5">Set Budget</button >
                    </div>
        

    
                <div className="col-6">
                    <div className="row">
                        <div className="col-12 border p-3 mb-3" style={{height:'30vh'}}>

                            <div className="row">
                            <div className ="col-6 text-start fw-bold">Welcome, User! </div>
                            <div className ="col-6 text-end fw-bold">
                              {new Date(Date.now()).toLocaleString('default', { day: 'numeric',month:'long', year:"numeric"})}
                                </div></div>
                            <div className="font-weight-bold fw-bold fs-4" 
                                style={{color:"#009df7"}}>Current Balance</div>
                            <div className="font-weight-bold p fs-4 fw-bold">$1000</div>

                            <div  className="row">
                            <div className="col-4 mt-3 fw-bold fs-5">Income</div>
                            <div className="col-4 mt-3 fw-bold fs-5" >Expenses</div>
                            <div className="col-4 mt-3 fw-bold fs-5">Budget</div>
                            </div>
                            <div  className="row">
                            <div className="col-4 p-1 fs-5">$2000</div>
                            <div className="col-4 p-1 fs-5"  style={{color:"red"}}>$5000</div>
                            <div className="col-4 p-1 fs-5">$1000</div>
                            </div>
                            <div  className="row">
                            <div className="col-4 mt-3 fw-bold">Average Income</div>
                            <div className="col-4 mt-3 fw-bold">Average Spending</div>
                            <div className="col-4 mt-3 fw-bold">Total Saving</div>
                            </div>

                            <div  className="row">
                            <div className="col-4 p-1">$2000</div>
                            <div className="col-4 p-1">$5000</div>
                            <div className="col-4 p-1">$1000</div>
                            </div>
                            <div className="row p-4" >On average you spend</div>


                        </div>
                        <div className="col-12 border p-3 fw-bold" style={{height:'60vh'}}>See your total income and spending trends in one place
                        <div className="row"><div className="col-2 text-end"><input type="date" className="form-control ml-auto col-3 text-end"></input></div></div>

                            <div>

                                <Line data={data} options={option2}></Line>
                            </div>
                        </div>
                    </div>
                </div>
                <div className ="col-3 bg-light border-start vh-100">
                    <div className="fw-bold"><p>Your spending habits visualized</p>
                    <div className="row"><div className="col-5" style={{position:"absolute", right:'0', maxWidth: 160, marginBottom:80}}><input type="date" className="form-control ml-auto"></input></div></div>
                    <div className="col-12 mt-5"><Pie data={data2} options={options}  />   </div></div>
                  
                    <button className="btn btn-primary m-5">See all expenses</button>
                </div>
                

            </div>

        </div>
    
  
    );
}
export default Dashboard;