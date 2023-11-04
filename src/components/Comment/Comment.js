import React from 'react'
import './Comment.css';
import { Link } from 'react-router-dom';
import { createTheme } from "@mui/material/styles";
import CardContent from '@mui/material/CardContent';
import { Avatar, InputAdornment, OutlinedInput } from '@mui/material';


function Comment(props) {
    const {text, userId, userName} = props;

  return (
      <CardContent className='comment'>
        <OutlinedInput
            disabled
            id="outlined-adornment-amount"
            multiline
            inputProps = {{maxLength : 25}}
            fullWidth
            value = {text}
            startAdornment = {
                <InputAdornment position="start">
                    <Link className='link' to={{pathname : '/users/'+userId}}>
                        <Avatar aria-label="recipe" className='small'>
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                </InputAdornment>
            }
            style = {{ color : 'black', backgroundColor: 'white'}}
        >
        </OutlinedInput>        
      </CardContent>
  )
}

export default Comment
