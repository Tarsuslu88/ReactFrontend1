import React, { useState } from 'react'
import './Comment.css';
import { Link, useNavigate } from 'react-router-dom';
import CardContent from '@mui/material/CardContent';
import { Avatar, InputAdornment, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import { PostWithAuth, GetRefreshTokenFunction } from '../../services/HttpService';



function CommentForm(props) {

    const { userId, userName, postId, forCommentsRefresh } = props;
    const [text, setText] = useState("");
    let navigate = useNavigate();

    const saveComments = () => {
        PostWithAuth("/comments",{
            postId : postId,
            userId: userId,
            text: text,
        })
        .then((res) => {
            if(!res.ok){              
                    GetRefreshTokenFunction()
                    .then(res => {
                        if(!res.ok){
                            handleLogout();
                        }else{
                            return res.json()
                        }
                    })
                    .then((result) => {
                        if(result != undefined)
                            localStorage.setItem("tokenKey", result.accessToken);
                            localStorage.setItem("refreshTokenKey", result.refreshToken);
                            saveComments();
                            forCommentsRefresh();
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            }else{
                res.json()
            }
        })
        .catch((err) => {
            console.log(err)
            
        })
    }


    const handleLogout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("refreshTokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("userName")
        navigate("/auth")
    }

    const handleSubmit = () => {
        saveComments();
        setText("");
        forCommentsRefresh();
    }

    const handleChangeText = (value) => {
        setText(value);
    }

    return (
        <CardContent className='comment'>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    inputProps={{ maxLength: 250 }}
                    fullWidth
                    value={text}
                    startAdornment={
                        <InputAdornment position="start">
                            <Link className='link' to={{ pathname: '/users/' + userId }}>
                                <Avatar aria-label="recipe" className='small'>
                                    {userName.charAt(0).toUpperCase()}
                                </Avatar>
                            </Link>
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <Button
                                variant='contained'
                                style={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}
                                onClick={handleSubmit}
                            >Comment
                            </Button>
                        </InputAdornment>
                    }
                    onChange={(i) => handleChangeText(i.target.value)}
                >
                </OutlinedInput>
            </CardContent>
    )
}

export default CommentForm
