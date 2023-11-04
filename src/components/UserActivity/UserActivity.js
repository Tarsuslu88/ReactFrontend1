import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Post from '../Post/Post';
import {GetWithAuth} from '../../services/HttpService'; 


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function PopUp(props) {
    const {isOpen, postId, setIsOpen} = props;
    const [open, setOpen] = useState(isOpen);
    const [post, setPost] = useState();

    const getPost = () => {
        GetWithAuth("/posts/"+postId,)
        .then(res => res.json())
        .then(
            (result) => {
                setPost(result);
            },
            (error) => {
                console.log("userActivity Error : " + error)
            }
        )

    }

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };

    useEffect(()=> {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(()=> {
        getPost();
    }, [postId]);

    return (
            post != null ?
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Close
                        </Typography>
                    </Toolbar>
                </AppBar>
                
                <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName} title={post.title} text={post.text} ></Post>
            </Dialog> : "loading"
    );
}


function UserActivity(props) {
    const { userId } = props;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const [selectedPost, setSelectedPost] = useState();
    const [isOpen, setIsOpen] = useState(false);


    const handleNotification = (postId) => {
        setSelectedPost(postId);
        setIsOpen(true);

    }


    const getActivity = () => {
        GetWithAuth("/users/activity/" + userId,)
            .then(res => res.json())
            .then((result) => {
                setIsLoaded(true);
                setRows(result)
            },
                (error) => {
                    console.log(error)
                    setIsLoaded(true);
                    setError(error);
                })
    };

    useEffect(() => {
        getActivity()
    }, [])

    return (
        <div>
            { isOpen ? 
            <PopUp isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen} /> : "" }
            <Paper sx={{ width: '100%', maxHeight: 440, minWidth:100, maxWidth:800, marginTop: 10, }}>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                User Activity
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => { */}
                            {rows.map((row) => {
                                return (
                                    <Button key={row.id} onClick={() => handleNotification(row[1])}>
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {row[3] + " " + row[0] + " your post"}
                                        </TableRow>
                                    </Button>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <TablePagination 
                rowsPerPageOptions={[10,25,100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            /> */}
            </Paper>
        </div>
    )
}

export default UserActivity
