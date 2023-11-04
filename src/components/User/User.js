import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Avatarr from '../Avatar/Avatarr';
import UserActivity from '../UserActivity/UserActivity';
import { GetWithAuth } from '../../services/HttpService';

function User() {
  const { userId } = useParams();
  const [userr, setUserr] = useState({});
  const [avatarId, setAvatarId] = useState();

  const getirUser = () => {
    GetWithAuth("/users/"+userId,)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        setAvatarId(result.avatarId)
        setUserr(result)
    },
    (error) => {
        console.log("user Error : " + error)
    })
  }

  useEffect(() => {
    getirUser()
  },[])

  return (
    <div style={{display:"flex"}}>
      {avatarId}
      
        <Avatarr avatarId={avatarId} userId={localStorage.getItem("currentUser")} userName={userr.userName} />
      
        
         
        <UserActivity userId={userId} />
      
    </div>
  )
}

export default User
