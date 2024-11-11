import React from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../axiosInstance'

const LogoutButton: React.FC = () =>  {
    const navigate = useNavigate()

    const logout = async (e: React.FormEvent) =>{
        e.preventDefault();
        try{
            const accessToken = localStorage.getItem('accessToken')
            const response  = await api.post('/logout',
                {accessToken}, 
                {withCredentials:true});
            if(response && response.status===200){
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
        }
        catch(err){
            console.log(err)
        }
    }
    
    return(        
    <button type="button" className="btn btn-danger mt-1" onClick={logout}>Log out</button>
    )
}
export default LogoutButton;