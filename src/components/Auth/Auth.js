import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { Button, FormControl, FormHelperText, InputLabel, TextField } from '@mui/material'
import { PostWithAuth } from '../../services/HttpService';
import { PostWithoutAuth } from '../../services/HttpService';

function Auth() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    let navigate = useNavigate();
    

    const handleUsername = (value) => {
        setUsername(value)
    }

    const handlePassword = (value) => {
        setPassword(value)
    }

    const sendRequest = (path) => {

        fetch("/auth/"+path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": localStorage.getItem("tokenKey"),
            },
            body : JSON.stringify({
                userName: username,
                password: password,
            })
        })
        .then(res => res.json())
        .then((result) => {
            localStorage.setItem("tokenKey", result.accessToken);
            localStorage.setItem("refreshTokenKey", result.refreshToken);
            localStorage.setItem("currentUser", result.userId);
            localStorage.setItem("userName", result.userName);
        })
        .catch((err) => console.log("eror var : " + err))
    }

    const handleButton = (path) => {
        sendRequest(path)
        setUsername("")
        setPassword("")
        if(path=="login"){
            navigate("/")
        }else{
            navigate("/auth")
        }
        
        console.log(localStorage)        
    }

    return (
        <FormControl style={{ top: 50 }}>
            
            <InputLabel style={{ top: -5 }}>Username</InputLabel>
            <TextField style={{ top: 10 }} onChange={(i) => handleUsername(i.target.value)} />           
            
            <InputLabel style={{ top: 80 }}>Password</InputLabel>
            <TextField style={{ top: 40 }} onChange={(i) => handlePassword(i.target.value)} />     
            
      
            <Button variant="contained"
                style={{
                    marginTop: 60,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                onClick={() => handleButton("register")}>Register</Button>
            <FormHelperText style={{ margin: 20 }}>Are you already registered?</FormHelperText>
            <Button variant="contained"
                style={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white'
                }}
                onClick={() => handleButton("login")}>Login</Button>
        </FormControl>
    )
}

export default Auth
