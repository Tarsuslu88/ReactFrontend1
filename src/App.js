import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import Home from './components/Home/Home';
import User from './components/User/User';
import Navbar from './components/Navbar/Navbar';
import Auth from './components/Auth/Auth';


function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/users/:userId" element={<User />}></Route>

        <Route path="/auth" element={ (localStorage.getItem("currentUser") != null) ? <Navigate from="/auth" to="/" /> : <Auth /> }></Route>
        
        
        {/* <Route path="/auth" element={<Auth />} ></Route> */}
      </Routes>
      
    </div>
  );
}

export default App;
