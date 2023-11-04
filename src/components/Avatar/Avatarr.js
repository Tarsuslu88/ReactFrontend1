import React, {useState} from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Radio from '@mui/material/Radio';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { PutWithAuth } from '../../services/HttpService';




function Avatarr(props) {
    const {avatarId, userId, userName} = props;

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(avatarId);

    const saveAvatar = () => {
        PutWithAuth("/users/"+localStorage.getItem("currentUser"),{
            avatar: selectedValue,
        })
        .then(res => res.json())
        .catch((error) => console.log(error))
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        saveAvatar();
    }


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


    return (
        <div>
            <Card sx={{ maxWidth: 345, margin: 10 }}>
                <CardMedia
                    //sx={{ height: 140 }}
                    component="img"
                    image={`/avatars/avatar${selectedValue}.png`}
                    title="User Avatar"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        User info
                    </Typography>
                </CardContent>
                <CardActions>
                    { localStorage.getItem("currentUser") == userId ? 
                    <Button className='primary' size="small" onClick={handleOpen}>Change Avatar</Button> : "" }
                    
                </CardActions>
            </Card>

            <Modal sx={{ display: "flex", maxWidth: 200 }}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <List dense>
                    {[1, 2, 3, 4, 5, 6].map((key) => {
                        const labelId = `checkbox-list-secondary-label-${key}`;
                        return (
                            <ListItem key={key}>
                                <CardMedia
                                    style={{ maxWidth: 100 }}
                                    component="img"
                                    alt={`Avatar n°${key}`}
                                    image={`/avatars/avatar${key}.png`}
                                    title="User Avatar"
                                />
                                <ListItemSecondaryAction>
                                    <Radio
                                        edge="end"
                                        value={key}
                                        onChange={handleChange}
                                        checked={"" + selectedValue === "" + key}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>

            </Modal>
        </div>

    )
}

export default Avatarr
