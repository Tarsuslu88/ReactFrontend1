import React, { useState, useEffect } from 'react'
import Post from '../Post/Post';
import './Home.css'
import Container from '@mui/material/Container';
import PostForm from '../Post/PostForm';

function Home() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const getPosts = () => {
        fetch("/posts")
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setPostList(result)
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )

    }

    useEffect(() => {
        getPosts()
    }, [])

    if (error) {
        return <div>Error !!!</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div className='ccontainerr2'>
                {localStorage.getItem("currentUser") == null ?  "" : 
                <PostForm userId = {localStorage.getItem("currentUser")} userName = {localStorage.getItem("userName")} getPosts={getPosts} />}
                
                {postList.map(post => (
                    <Post key={post.id} postId={post.id} userId={post.userId} userName={post.userName} title={post.title} text={post.text} likes={post.postLikes} createDate={post.createDate}></Post>
                ))}
            </div>
        )
    }

}

export default Home
