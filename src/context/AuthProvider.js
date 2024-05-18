import React from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useState } from "react";
import {Spin} from 'antd';

export const AuthContext = React.createContext();

export default function AuthProvider({children}){
    const [user, setUser] = useState({});
    const history = useNavigate();
    // loading effect
    const [isloading, setIsLoading] = useState(true);

    React.useEffect(() => {

        const unsubscibed = auth.onAuthStateChanged((user) => {
            if(user)
            {
                const { displayName, email, uid, photoURL } = user;
                
                setUser({ displayName, email, uid, photoURL });
                
                history('/React-Chat');
                setIsLoading(false);
                return;
            }
            
            setIsLoading(false);
            history('/login');
            
        
        });

        // Clean function
        return () => {
            unsubscibed();
        }

    }, [history])

    return (
        <AuthContext.Provider value={{ user }}>
            {isloading ? <Spin/> : children}
        </AuthContext.Provider>
    )

}