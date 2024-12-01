import 'bootstrap/dist/css/bootstrap.min.css';
import Progress from "./dashboard/Progress"
import Stats from "./dashboard/DataDisplay"
import GraphSection  from "./dashboard/GraphSection";
import PieSection from "./dashboard/PieSection"
const Dashboard:React.FC = () =>{

    return(

       <div className="container-fluid" style={{width:'100vw' , maxWidth:'none'}}>
        <h3>Dashboard</h3>
        <div className="row p-4"></div>
            <div className="row">
                <Progress/>
            <div className="col-5">
            <div className="row">
                <Stats/>
                <GraphSection/>
            </div>
            </div>
                <PieSection/>
            </div>
        </div>
    );
}
export default Dashboard;