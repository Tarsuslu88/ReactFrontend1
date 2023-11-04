import React from 'react';
import './Navbar.css';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { LockOpen } from '@mui/icons-material';


function Navbar() {
    let navigate = useNavigate();
    let user = localStorage.getItem("currentUser");
    let userN = localStorage.getItem("userName");

    const handleLogout = () => {
      localStorage.removeItem("tokenKey")
      localStorage.removeItem("refreshTokenKey")
      localStorage.removeItem("currentUser")
      localStorage.removeItem("userName")
      navigate("/auth")
    }
    
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'left' }}>
              <Link className='navlink' to="/">Home</Link>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign:'right' }}>

              {localStorage.getItem("currentUser") == null ? 
              <Link className='navlink' to='/auth'> Login/Register </Link> :
              <div>
                <IconButton onClick={handleLogout} style={{color:'white'}}><LockOpen></LockOpen></IconButton>
                <Link className='navlink' to={(localStorage.getItem("currentUser")!=null)?{ pathname: '/users/' + user}:"/"}>                 
                  Profile ( {userN.charAt(0).toUpperCase()} )              
                </Link>
              </div>             
              }

            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}

export default Navbar
