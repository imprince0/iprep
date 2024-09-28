
import React, { useState } from 'react'
import '../App.css'
import { Link,  useNavigate } from 'react-router-dom'
import Navbar from './Navbar';

const Login = () => {

  let navigate = useNavigate();
  
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = "http://localhost:5000/api/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });
      const json = await response.json();
      if (json.success === true) {
        console.log(json);
        localStorage.setItem("token", json.authToken);
        navigate('/');
        // props.showalert("Logged in Successfully ", "success");
      }
      else {
        // props.showalert("Invalid credentials ", "danger");
        alert("invalid credential");
      }
    }
    const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
  return (
    <>
    <Navbar/>
    <div id="login-form-wrap">
    <h3 className="login-head">Login</h3>
    <form onSubmit={handleSubmit} id="login-form">
      <p>
      <input type="email" id="email" name="email" onChange={onChange} placeholder="Email Address" required/><i className="validation"><span></span><span></span></i>
      </p>
      <p>
      <input type="password" id="password" onChange={onChange} name="password" placeholder=" Password" required/><i className="validation"><span></span><span></span></i>
      </p>
      <p>
      <input type="submit"  id="login" value="Login"/>
      </p>
    </form>
    <div id="create-account-wrap">
      <p>Not a member? <Link to="/signup">Create Account</Link></p>
    </div>
  </div>
  </>
  )
}

export default Login
