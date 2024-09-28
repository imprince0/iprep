import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar';

const Signup = () => {
    const [account,setAccount]=useState({"name":"","email":"","password":"","cpassword":""});
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
      e.preventDefault();
      if(account.cpassword===account.password){
        const {name,email,password}=account;
        const url="http://localhost:5000/api/auth/createuser";
            
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          
          body: JSON.stringify({name,email,password})
        });
        const json=await response.json();
        console.log(json.success);
        if(json.success===true){
          
          navigate('/login');
          // props.showalert("User created successfully ","success")
        }
        else{
          // props.showalert(json.error,"danger");
          alert('Invalid user credential');
        }
      }
      else{
        // props.showalert("Both password must be same","danger");
        alert("both password must be same");
      }
    }
    const onChange=(e)=>{
      setAccount({...account,[e.target.name]:e.target.value});
  }
  return (
    <div>
      <Navbar/>
      <div id="login-form-wrap">
    <h3 className="login-head">Register</h3>
    <form onSubmit={handleSubmit} id="login-form">
      <p>
      <input type="text" id="name" name="name" onChange={onChange} placeholder="Username" required/><span></span><span></span>
      </p>
      <p>
      <input type="email" id="email" name="email" onChange={onChange} placeholder="Email Address" required/><i className="validation"><span></span><span></span></i>
      </p>
      <p>
      <input type="password" id="password"  name="password" onChange={onChange} minLength={5} placeholder=" password" required/><i className="validation"><span></span><span></span></i>
      </p>
     
      <p>
      <input type="password" id="cpassword" name="cpassword" onChange={onChange}  minLength={5} placeholder=" Confirm password" required/><i className="validation"><span></span><span></span></i>
      </p>
      <p>
      <input type="submit" id="signup" value="Register"/>
      </p>
    </form>
    <div id="create-account-wrap">
      <p>Already account <Link to="/login">Login</Link></p>
    </div>
  </div>
      
    </div>
  )
}

export default Signup
