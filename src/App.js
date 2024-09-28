import Navbar from './components/Navbar.js'
import './App.css';
import Login from './components/Login.js';

import {
  BrowserRouter as Router,
  Routes,
  Route, 
} from "react-router-dom";
import Signup from './components/Signup.js';
import Home from './components/Home.js';
import Sender from './components/Sender.js';
import Receiver from './components/Receiver.js';
import Compiler from './components/Compiler.js';

function App() {
  return (
<div>
  <Router>
    {/* <Navbar/> */}
  <Routes>
    <Route  exact path="/" element={<Home/>}/>
    <Route  exact path="/login" element={<Login/>} />
    <Route  exact path="/sender" element={<Sender/>}/>
    <Route  exact path="/receiver" element={<Receiver/>}/>
      <Route exact path="/signup" element={<Signup/>} />
      <Route exact path="/compiler" element={<Compiler/>} />
  </Routes>
</Router>
</div>
  );
}

export default App;
