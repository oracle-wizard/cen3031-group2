import Progress from "../components/dashboard/Progress"
import Stats from "../components/dashboard/DataDisplay"
import GraphSection  from "../components/dashboard/GraphSection";
import PieSection from "../components/dashboard/PieSection"
const Dashboard:React.FC = () =>{

    return(

       <div className="container-fluid" style={{width:'100vw' , maxWidth:'none'}}>
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