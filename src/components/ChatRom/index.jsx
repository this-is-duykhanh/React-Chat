import React from "react";
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'

export default function Chatroom(){

    const [isHidden, setIsHidden] = React.useState(false);

    const toggleHidden = () => {
        setIsHidden(!isHidden);
    };

    return (
        <div className='home'>
            <div className="container">
              
                <Sidebar isHidden={isHidden} handleRoomClick={toggleHidden}/>
                <ChatWindow handleRoomClick={toggleHidden} isHidden={isHidden}/>
        
            </div>
        </div>
    )
}