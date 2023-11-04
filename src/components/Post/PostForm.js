import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Post.css'
import '../Navbar/Navbar.css'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
//import { red } from '@mui/material/colors';
import { OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { PostWithAuth, GetRefreshTokenFunction } from '../../services/HttpService';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function PostForm(props) {
    const { userId, userName, getPosts } = props;
    const [text, setText] = useState();
    const [title, setTitle] = useState();
    const [open, setOpen] = React.useState(false);
    let navigate = useNavigate();

    const savePost = () => {
        PostWithAuth("/posts",{
            title: title,
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
                        savePost();
                        getPosts();
                })
                .catch((err) => {
                    console.log(err)
                })

        }else{
            res.json()
        }
        })
        .catch((err) => console.log("error"))
    }

    const handleSubmit = () => {
        savePost();
        setTitle("");
        setText("");
        setOpen(true);
        getPosts();

    }

    const handleLogout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("refreshTokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("userName")
        navigate("/auth")
    }

    const handleChangeTitle = (value) => {
        setTitle(value);
    }

    const handleChangeText = (value) => {
        setText(value);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Your post is sent!
                </Alert>
            </Snackbar>
            <Card className='cardstil'>
                <CardHeader
                    avatar={
                        <Link className='navlink' to='/'>
                            {/* <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"> */}
                            <Avatar sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }} aria-label="recipe">
                                {userName.charAt(0).toUpperCase() }
                            </Avatar>
                        </Link>
                    }
                    title={
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            name="title"
                            multiline
                            placeholder='Title'
                            inputProps={{ maxLength: 25 }}
                            fullWidth
                            value={title}
                            onChange={(i) => handleChangeTitle(i.target.value)}
                        >
                        </OutlinedInput>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            name="text"
                            multiline
                            placeholder='Text'
                            inputProps={{ maxLength: 250 }}
                            fullWidth
                            value={text}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button
                                        variant='contained'
                                        style={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}
                                        onClick={handleSubmit}
                                    >Post
                                    </Button>
                                </InputAdornment>
                            }
                            onChange={(i) => handleChangeText(i.target.value)}
                        >
                        </OutlinedInput>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default PostForm;
