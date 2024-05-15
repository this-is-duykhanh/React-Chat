import React from 'react';
import {Row, Col, Button, Typography} from 'antd';
import  firebase, { auth } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';
const {Title} = Typography;


const fbProvider = new firebase.auth.FacebookAuthProvider();
const emailProvider = new firebase.auth.GoogleAuthProvider();


export default function Login() {

    const [error, setError] = React.useState(null);
    const handleFbLogin = async () => {
        try {
            const { additionalUserInfo, user } = await firebase.auth().signInWithPopup(fbProvider);

            if (additionalUserInfo?.isNewUser) {
                addDocument('users', { 
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                    keywords: generateKeywords(user.displayName)
                });
            }
        } catch (error) {
            if (error.code === 'auth/cancelled-popup-request') {
                setError('Another authentication popup is already open. Please close it and try again.');
            } else {
                setError('An error occurred during authentication. Please try again later.');
            }
        }
    };

    const handleEmailLogin = async () => {
        try {
            const { additionalUserInfo, user} = await auth.signInWithPopup(emailProvider);

            if(additionalUserInfo?.isNewUser){
                addDocument('users',{ 
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                    keywords: generateKeywords(user.displayName)
                })
            }
            
        } catch (error) {
            if (error.code === 'auth/cancelled-popup-request') {
                setError('Another authentication popup is already open. Please close it and try again.');
            } else {
                setError('An error occurred during authentication. Please try again later.');
            }
        }
    };
    
    return(
        <div>
            <Row justify='center' style={{height: 800}}>
                <Col span={8}>
                    {error && <p>{error}</p>}
                    <Title style={{texAlign: 'center'}} Level={3} >Chat With Friend</Title>
                    <Button style={{width: '100%', marginBottom: 5}} onClick={handleEmailLogin}>
                        Login by Google
                    </Button>
                    <Button style={{width: '100%', marginBottom: 5}} onClick={handleFbLogin}>
                        Login by Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}