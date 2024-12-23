import React from "react";
import { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = React.createContext();

export default function AppProvider({children}){
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isInviteMember, setIsInviteMember] = useState(false);

    const {user: {uid}} = React.useContext(AuthContext);
    
    const roomCondition = React.useMemo(() => {

        if(uid){
            return{
                fieldName: "members",
                operator: "array-contains",
                compareValue: uid,
            };
        }
        
    }, [uid]);

    const rooms = useFirestore('rooms', roomCondition);


    const selectedRoom = React.useMemo(
        () => 
            rooms.find((room) => room.id === selectedRoomId) || {},
          
        [rooms, selectedRoomId]
    );

    const usersCondition = React.useMemo(() => {
        if(selectedRoom.members){
            return{
                fieldName: 'uid',
                operator: 'in',
                compareValue: selectedRoom.members,
            };

        }

        
    },[selectedRoom.members]);


    const members = useFirestore('users', usersCondition);

    return (
        <AppContext.Provider value={{ rooms, isInviteMember, setIsInviteMember, members, selectedRoom, isAddRoomVisible, setIsAddRoomVisible, selectedRoomId, setSelectedRoomId}}>
            {children}
        </AppContext.Provider>
    )
}