import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'
const Navbar = () => {
  const HandleLogOut=()=>{
    localStorage.removeItem('token');
    window.parent.location = window.parent.location.href;
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark" >
  <div className="container-fluid">
    <img src={logo} style={{height: "50px", width: "50px" , borderRadius:"50px"}} alt="" />
    <a className="navbar-brand text-white" href="/"> Iprep </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link Link-remove-underline text-white" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link Link-remove-underline text-white" aria-current="page" to="/compiler">Compiler</Link>
        </li>
      </ul>
      <form className="d-flex " >
        {
          (!localStorage.getItem('token')) ? <Link to="/login"><button className="btn btn-primary mx-3" type="submit">Login</button></Link>:<Link to="/"><button className="btn btn-primary mx-3" onClick={HandleLogOut} type="submit">LogOut</button></Link>
        }
      <Link to="/signup"><button className="btn btn-primary mx-3" type="submit">SignUp
        </button></Link>
      </form>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
