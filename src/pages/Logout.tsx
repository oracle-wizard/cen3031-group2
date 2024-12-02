import React from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../axiosInstance'
import { useAuth } from '../../server/src/context/authContext'

const LogoutButton: React.FC = () =>  {
    const navigate = useNavigate()
    const { logout } = useAuth(); // Get the logout function from AuthContext

    const logoutHandler = async (e: React.FormEvent) =>{
        e.preventDefault();
        try{
            const accessToken = localStorage.getItem('accessToken')
            const response  = await api.post('/logout',
                {accessToken}, 
                {withCredentials:true});
            if(response && response.status===200){
                localStorage.removeItem('accessToken');
                logout();
                navigate('/login');
            }
        }
        catch(err){
            console.log(err)
        }
    }
    
    return(        
    <button type="button" className="btn btn-danger mt-1" onClick={logoutHandler}>Log out</button>
    )
}
export default LogoutButton;