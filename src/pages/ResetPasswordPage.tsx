import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../axiosInstance'

const ResetPassword: React.FC =()=>{
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const [message, setMessage] = useState('');
    const  handleChange = async(e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        if(name==="email")
            setEmail(value);
        else if(name==="code")
            setCode(value)

   }
   const [showButtons, setShowButtons] = useState(false);
   const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();
    if(!email){
        setMessage("Please enter an email address.")}
    setShowButtons(true);

    try{
        const reponse = await api.post('/reset-password', {email}, {
            headers: {
              'Content-Type': 'application/json',
            }});
        if(reponse.status ===200){
            setMessage("Please check your email ")
        }

    }
    catch(err){

    }
}

    const handleCodeSubmit = async(e: React.FormEvent)=>{
        if(!code){
            setMessage("Please enter code")
            return;
        }
        try{
            const response = await api.post('/verify-code', {email, code});
            if(response.status===200){
                setMessage("Password has been reset successfully")
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
    <div className="container text-center">
        <h2 style={{color:'#006D5B', fontWeight:'bold', marginBottom:'20px'}}>Get Back Into Your Account</h2>
    <p>
        To recover your account, begin by entering<br />
        the email address or username used to create your account.
    </p>
    <form>
    <div className="form-group">
    <label htmlFor = "email" style={{marginTop :'50px', fontWeight:'bold'}}>Email or Username</label>
    <input 
        className ="form-control"
        type="text"
        name="email"
        placeholder="Email"
        value={email}
        onChange={handleChange}
        required
        autoFocus
        style={{
            marginBottom:'20px', 
            marginTop:'10px',
            maxWidth:'300px', 
            marginLeft: 'auto', 
            marginRight:'auto'
            }}>
        </input>
        </div>
        {showButtons 
        ? (<div className="container text-center">
        <label htmlFor ="code" style={{fontWeight:'bold'}}>Verification Code
        </label>
        <input className = "form-control"
            type="text"
            name="code"
            placeholder="code"
            value = {code}
            onChange={handleChange}
            style={{marginTop:"10px", maxWidth:'300px', marginLeft: 'auto', marginRight:'auto', marginBottom:"50px"}}
            //value={code}
            //onChange={}
            required>
            </input>
            <div className="mb-2"><button onClick = {handleCodeSubmit} className = "btn btn-success" style={{padding:"10px", marginBottom: "20px", marginTop:"20px", fontWeight:'bold', width:"300px" }}>Continue</button></div>
            <div className="mb-2"><button className = "btn btn-light" style={{padding:"10px", width: "300px"}}>Resend Code</button></div></div>)
        : (<button type="submit" className="btn btn-primary"  onClick={handleSubmit}
            style={{padding:'10px',
            borderRadius:'5px'}}>
            Reset password</button>)}
        </form>
    </div>)
}
export default ResetPassword;