import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import api from '../axiosInstance'

const ResetPassword: React.FC =()=>{
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [newPassword, setNewPassword] = useState('')
   const [showButtons, setShowButtons] = useState(false);
   const [redirectToLogin, setRedirectToLogin] = useState(false);


 //useEffect(() =>{
     //   const timer = setTimeout(()=>{
        //    navigate('/login')}, 3000);
     //   return () => clearTimeout(timer);}
    //,[redirectToLogin])

   const validatePassword = (password : string)=>{

    if(password.length<8 || !/\d/.test(password) || ! /[A-Z]/.test(password) ||  ! /[a-z]/.test(password) || ! /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)){
        return 'Password must contain at least one number.'
    }
    return '';
   }
   const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();
    if(!email){
        setError("Please enter an email address.")
        return}
    setShowButtons(true);
    
    try{
        const reponse = await api.post('/reset-password', {email}, {
            headers: {
              'Content-Type': 'application/json',
            }});
        if(reponse.status ===200){
            console.log("response is 200")
            setSuccess("Please check your email. ")

        }

    }
    catch(err){

    }

}
    const handleCodeSubmit = async(e: React.FormEvent)=>{
        setError('');
        setSuccess('');
        e.preventDefault();
        if(!code){
            setError("Please enter your code.")
            return;
        }
        try{
            const response = await api.post('/verify-code', {email, code});
            if(response.status===200){
                setSuccess('Successfully verified. You can now set your new password.')
                setShowButtons(false);
                setShowPassword(true);
            }
        }catch(error){
            if(error.response){
                console.log('Response error:', error.response);
                setError("An error has occured")
            }
            else{
                setError("An error has occured")
                
            }

        }
    }
    const handleResendCode =async (e :React.FormEvent)=>{
        setError('');
        setSuccess('');
        e.preventDefault()
        if(!email){
            setError("Please enter your email address first.");
            return;
        }
        try{
            const reponse = await api.post('/reset-password', {email}, {
                headers: {
                  'Content-Type': 'application/json',
                }});
            if(reponse.status ===200){
                setSuccess("Verification code has been resent. Please check your email. ")
            }
    
        }
        catch(err){
            setError('An error has occured.')
        }

    }

    const resetPassword = async (e:  React.FormEvent)=>{
        setError('');
        setSuccess('');
        e.preventDefault()
        console.log("resetting password")
        if(!newPassword){ //add validation rules
            setError("Please enter a new password.")
            console.log("empty body")
            return;
        }
        const  passwordErr = validatePassword(newPassword);
        if(passwordErr){
            setError(`Password must be at least 8 characters, 1 number, 1 special character, 1 uppercase.`);
            return;
        }
      try{
            const response = await api.post('/new-password', {password: newPassword, email})
            if(response.status===201){
                console.log("status 200")
                setSuccess("Password has been succesfully reset. Redirecting to login page.");
                const timer = setTimeout(() => {
                    navigate('/login');
                  }, 3000);
              
                  return () => clearTimeout(timer);
            
            
        }
    }catch(err){
            setError("An error has occured. Please try again")
            console.log(err);
        }
    }

    return(
    <div className="container text-center">
        <h2 style={{color:'#0251a1', fontWeight:'bold', marginBottom:'20px'}}>Get Back Into Your Account</h2>
    <p>
        To recover your account, begin by entering<br />
        the email address or username used to create your account.
    </p>
    <form className="form-register" onSubmit={showPassword ? resetPassword : handleSubmit }>
        <div className="form-group">
        {error && <p className="message" style={{color: 'red'}}>{error}</p>}
        {success && <p className="message" style={{color: 'green'}}>{success}</p>}


        <label htmlFor = "email" style={{marginTop :'50px', fontWeight:'bold'}}>Email or Username</label>
        <input 
            className ="form-control"
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange= {(e)=> setEmail(e.target.value)}
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
        {showPassword && (<div>
            <input className ="form-control"
                    type = "text"
                    name="password"
                    placeholder="Password" 
                    onChange = {(e)=>setNewPassword(e.target.value)}>
                    </input></div>)}
        {showButtons ?
         ( <div className="container text-center">
            <label htmlFor ="code" style={{fontWeight:'bold'}}>Verification Code</label>
            <input 
            className = "form-control"
            type="text"
            name="code"
            placeholder="Code"
            value = {code}
            onChange={(e)=>setCode(e.target.value)}
           style={{
                marginTop:"10px",
                maxWidth:'300px',
                marginLeft: 'auto',
                marginRight:'auto',
                marginBottom:"50px"}}
                required />
                <div className="mb-2">
                <button onClick = {handleCodeSubmit} 
                className = "btn btn-success"
                style={{padding:"10px",
                marginBottom: "20px",
                marginTop:"20px",
                fontWeight:'bold', 
                maxWidth:"300px" 
                }}>
                Continue
                </button>
                </div>
                <div className="mb-2">
                <button className = "btn btn-light" style={{padding:"10px", maxWidth: "300px"}} 
                onClick={handleResendCode}>Resend Code</button></div></div>)
            : (<button type="submit" className="btn btn-primary"  
                style={{padding:'10px',
                borderRadius:'5px', 
                marginTop:"20px",
                fontWeight:'bold', 
                maxWidth:"300px" }}>
                Reset password
            </button>)}
           
       

        </form>
    </div>)



}
export default ResetPassword;