import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Post.css'
import '../Navbar/Navbar.css'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import Container from '@mui/material/Container';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';
import { PostWithAuth, GetRefreshTokenFunction, DeleteWithAuth } from '../../services/HttpService'


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));





function Post(props) {
    const { title, text, userId, userName, postId, likes, createDate, getPosts } = props;
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const isInitialMount = useRef(true);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [likeId, setLikeId] = useState(null);
    const [refresh, setRefresh] = useState(false);
    let disabled = localStorage.getItem("currentUser") == null ? true : false;
    let navigate = useNavigate();


    const forCommentsRefresh = () => {
        setRefresh(true);
    }



    const handleExpandClick = () => {
        getComments();
        setExpanded(!expanded);
    };

    const handleLike = () => {
        setLiked(!liked);
        if(!liked){
            setLikeCount(likeCount + 1)
            saveLike()
        }else{
            setLikeCount(likeCount - 1)
            deleteLike();
        }           
    }

    const getComments = () => {
        fetch("/comments?postId="+postId)
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setCommentList(result)
                setCommentCount(result.length)
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
        setRefresh(false)
    }

    const saveLike = () => {
        PostWithAuth("/likes",{
            postId: postId,
            userId : localStorage.getItem("currentUser"),
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
                        saveLike();
                })
                .catch((err) => {
                    console.log(err)
                })

            }else{
                res.json()
            }
        })
        .catch((err) => console.log(err))
    }

    const handleLogout = () => {
        localStorage.removeItem("tokenKey")
        localStorage.removeItem("refreshTokenKey")
        localStorage.removeItem("currentUser")
        localStorage.removeItem("userName")
        navigate("/auth")
    }

    const deleteLike = () => {
        DeleteWithAuth("/likes/"+likeId,)
        .catch((err) => console.log(err))
    }

    const checkLikes = () => {
        let likeControl = likes.find((like => ""+like.userId === localStorage.getItem("currentUser")));
        if(likeControl != null){
            setLiked(true);
            setLikeId(likeControl.id);
        }          
    }

    useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false;
        else
        getComments();    
    }, [refresh])

    useEffect(() => {checkLikes()}, [])

    return (
        <Card className='cardstil'>
            <CardHeader
                avatar={
                    <Link className='navlink' to={{pathname:'/users/' + userId}}>
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Link>
                }
                title={title}
                subheader={createDate}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {text}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>

                {disabled ?
                <IconButton disabled onClick={handleLike} aria-label="add to favorites">
                    <FavoriteIcon style={liked ? {color:'red'} : null} />
                </IconButton> :
                <IconButton onClick={handleLike} aria-label="add to favorites">
                <FavoriteIcon style={liked ? {color:'red'} : null} />
                </IconButton>
                }
                {likeCount}
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <CommentIcon />                   
                </ExpandMore>
                {commentCount}
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                
                <Container fixed>
                    {disabled ? "" : <CommentForm forCommentsRefresh={forCommentsRefresh} userId={localStorage.getItem("currentUser")} userName={localStorage.getItem("userName")} postId={postId} />}
                    
                    {error? 'error' : isLoaded? commentList.map(comment => (
                        <Comment key={comment.id} userId = {comment.userId} text = {comment.text} userName={comment.userName} ></Comment>
                    )): 'Loading'}
                </Container>
            </Collapse>
        </Card>
    )

}

export default Post;
