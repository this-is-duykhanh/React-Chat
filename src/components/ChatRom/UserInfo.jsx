import { Avatar, Button } from "antd";
import React from "react";
import { auth } from "../../firebase/config";
import { AuthContext } from "../../context/AuthProvider";

export default function UserInfo()
{

    const {user: {
        displayName,
        photoURL
    } } = React.useContext(AuthContext);

    return (
<div className='navbar'>
    <div className="user">
        <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>  
        <span >{displayName}</span>
    </div>
    <Button ghost onClick={() => auth.signOut()}>log out</Button>

</div>
    )
}