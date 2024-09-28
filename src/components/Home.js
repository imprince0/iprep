import React from 'react'

import { Link } from 'react-router-dom'
import Navbar from './Navbar'

const Home = () => {
  
  return (
    <>
    
  <Navbar/>
    <div  className="home">
      {localStorage.getItem('token') && <div className="meeting-button " id="home1">
      <h2> Welcome to our techPrep</h2>
      <i>click to create a new meeting</i>
        <Link to="/sender" style={{width: "400px"}}><button className="btn btn-primary" style={{width: "100%"}}>Create a new meeting</button></Link>{'\n'}
        <h3 style={{marginLeft: "180px"}}>Or</h3>{'\n'}
        <form  action="">
            <i>Join meet with userid of host </i>
            {/* <input type="text" placeholder='Enter host userId' id='join-meet-with-id' className='join-meet'/> */}
            <Link to="/receiver"><button className="btn btn-primary">Join meeting</button></Link>{'\n'}
        </form>
      </div>}
      {!localStorage.getItem('token') &&<div className="meeting-home-2" id="home2">
        <h2>Welcome to pretech </h2>
        <div className="welcome-section" style={{fontSize: "18px"}} >
        <i>To create and join meet login first</i>
        <Link to="/login"><button className='btn btn-primary' style={{margin: "12px",width: "200px"}} >login</button></Link>
        </div>
      </div>}
    </div>
    </>
  ) 
}

export default Home
