import { LeftOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Tooltip, Input, Form, Alert, Collapse } from "antd";
import React, { useContext, useMemo, useState, useEffect, useRef, useCallback} from "react";
import styled from "styled-components";
import Message from "./Message";
import { AppContext } from "../../context/AppProvider";
import { addDocument, upload } from "../../firebase/services";
import { AuthContext } from "../../context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import { LinkOutlined ,PictureFilled } from '@ant-design/icons';
import { Col } from 'antd';
import {db} from '../../firebase/config'

const { Panel } = Collapse;

const ButtonGroupStyled = styled.div`
    dislay: flex;
    align-items: center;
`;

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 2px 3px 0;
    border: 1px solid rgb(230, 230,230);
    border-radius: 2px;

    .ant-form-item{
        flex: 1;
        margin-bottom: 0;
    }

    margin-bottom: 0.5rem;
`;


const PanelStyled = styled(Panel)`
    

    &&& {
        
        .ant-collapse-header, p{
            color: white;
            position: absolute;
            top: 0.6rem;
            right: 0;
            width: 100px;
        }

        .ant-collapse-content-box{
            width: 90px;

            color: black;
            position: absolute;
            top: 0;
            right: 0.2rem;
            padding: 0;
            margin-top: 4.4rem;
            background-color: #fff;
        }

    }
`;

export default function ChatWindow({handleRoomClick, isHidden})
{
    const { selectedRoom, members, setIsInviteMember, selectedRoomId } = useContext(AppContext);
    const [inputValue, setInputValue] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: "",
      });


      const [attachFile, setAttachFile] = useState({
        file: null,
        url: "",
      });
    

    const [form] = Form.useForm();
    const {user: {
        uid, photoURL, displayName
    }} = useContext(AuthContext)

    const handleOnSubmit = useCallback( async (e) => {
        let imgUrl = null;

        let fileUrl = null;

        try {
            if(img.file){
                imgUrl = await upload(img.file)
            }

            if(attachFile.file){
                fileUrl =  await upload(attachFile.file)
            }

            addDocument('messages', {
                text: inputValue,
                uid,
                photoURL,
                roomId: selectedRoom.id, 
                displayName,
                img: imgUrl,
                file: fileUrl,
            });

        } catch (error) {
            alert(error)
        }

        setImg({
            file: null,
            url: "",
        })

        setAttachFile({
            file: null,
            url: "",
        })
       
        form.resetFields(['messages']);
        setInputValue(''); 
    }, [img, attachFile, inputValue, selectedRoom.id, uid, photoURL, displayName, form]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    
    const condition = useMemo(() => ({
        fieldName: 'roomId',
        operator: '==',
        compareValue: selectedRoom.id
    }), [selectedRoom.id])

    const messages = useFirestore('messages', condition);

    const messageListRef = useRef(null);
    useEffect(() => {
        if (messageListRef?.current) {
          messageListRef.current.scrollTop =
            messageListRef.current.scrollHeight + 50;
        }
      }, [messages]);

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };


    const handleAttachFile = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            let fileSize = file.size / 1024; 
            let sizeUnit = "KB"; 
    
          
            if (fileSize > 1024) {
                fileSize /= 1024; 
                sizeUnit = "MB"; 
            }
    
            const fileSizeFormatted = fileSize.toFixed(2);
    
            const fileInfo = `${file.name}\n${fileSizeFormatted} ${sizeUnit}`; 
    
            setAttachFile({
                file: file,
                url: URL.createObjectURL(file),
            });

            setInputValue(fileInfo);
        }
    }
    
    
    useEffect(() => {
        if (attachFile.file !== null || img.file !== null) {
            handleOnSubmit();
        }
    }, [attachFile.file, img.file, handleOnSubmit]);
    

    const [span, setSpan] = useState(window.innerWidth < 500 ? 24 : 16);

    useEffect(() => {
        const handleResize = () => {
            setSpan(window.innerWidth < 500 ? 24 : 16);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);




    const leaveRoom = (e) => {
        const roomRef = db.collection('rooms').doc(selectedRoomId);
        const updateMembers = selectedRoom.members.filter(memberId => memberId !== uid);

        if(updateMembers.length === 0){
            const confirmed = window.confirm("Do you really want to disband the group?")
            if(confirmed){

                roomRef.delete()
                .then(() => {
                    console.log("Room deleted successfully");
                })
                .catch(error => {
                    console.error("Error deleting room: ", error);
                });

                if(span === 24){
                    handleRoomClick()
                }

            }
        }
        else{
            const confirmed = window.confirm("Do you really want to leave?")
            if(confirmed){
           
                roomRef.update({
                    members: updateMembers
                })
                .then(() => {
                    console.log("Member removed from the room");
                })
                .catch(error => {
                    console.error("Error removing member from room: ", error);
                });

                if(span === 24){
                    handleRoomClick()
                }
            }
        }

    }

    const collapseRef = useRef(null);

    const [isActive, setIsActive] = useState(false);
    const handleHeaderClick = () => {
        setIsActive(!isActive);
    };
    

    return (
        <Col className="chat" span={span}>
            {
                selectedRoom.id ? (
                    <>
                    
                 <div className="chatInfo">
                    
                    
                    <div className="header__info">

                        {isHidden ? 
                        <button className="btn-leave" onClick={handleRoomClick}>
                            <LeftOutlined style={{fontSize: '1.2rem', fontWeight:'bold'}}/>
                        </button> 
                        
                        : null}

                        <div className="chat__header__info" >
                            <p className="header__title">{selectedRoom.name}</p>
                            <span className="header__description">{selectedRoom.desc}</span>
                        </div>
                    </div>
                    
                    {span === 24? (

                        <Collapse ghost defaultActiveKey={['1']} ref={collapseRef} activeKey={isActive ? '1' : ''}>
                            <PanelStyled onClick={handleHeaderClick} header= { 
                                    <Avatar.Group size={"small"} maxCount={2}>
                                        {
                                            members.map(member => <Tooltip key={member.id} title={member.displayName}>
                                                                    <Avatar src={member.photoURL}>{member.photoURL? '' : member.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                                                                </Tooltip>
                                                        )
                                        }
                                    </Avatar.Group>} 
                                    key="1"
                                    isActive={isActive}
                                    
                                    >

                                <ButtonGroupStyled> 
                                    <Button style={{ color: 'black',fontWeight: 'bold'}} icon={<UserAddOutlined/>} type="text" onClick={() => setIsInviteMember(true)}>Invite</Button>
                                    
                                    <Button style={{ color: 'black', fontWeight: 'bold'}} type="text" onClick={() => leaveRoom()}>
                                        <span className="ant-btn-icon">
                                            <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" class="x19dipnz x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"><g fill-rule="evenodd" transform="translate(-446 -398)"><g fill-rule="nonzero"><path d="M105 220.75v2.855a.9.9 0 0 1-.895.895h-9.71a.9.9 0 0 1-.895-.895v-15.21a.9.9 0 0 1 .895-.895h9.71a.9.9 0 0 1 .895.895v3.355a.75.75 0 1 0 1.5 0v-3.355a2.4 2.4 0 0 0-2.395-2.395h-9.71A2.4 2.4 0 0 0 92 208.395v15.21A2.4 2.4 0 0 0 94.395 226h9.71a2.4 2.4 0 0 0 2.395-2.395v-2.855a.75.75 0 1 0-1.5 0z" transform="translate(355 192)"></path><path d="M102.25 217h7.5a.75.75 0 1 0 0-1.5h-7.5a.75.75 0 1 0 0 1.5z" transform="translate(355 192)"></path><path d="M107.324 218.011a.75.75 0 0 0 1.06 1.06l2.292-2.29a.75.75 0 0 0 0-1.061l-2.292-2.292a.75.75 0 0 0-1.06 1.06l1.761 1.762-1.761 1.761z" transform="translate(355 192)"></path></g></g></svg>
                                        </span>
                                        Leave

                                    </Button>
                                    
                                   
                                </ButtonGroupStyled>
                            </PanelStyled>

                        </Collapse>
                        
                    ) 
                    : 
                    (
                        <ButtonGroupStyled> 
                            <Button icon={<UserAddOutlined/>} type="text" onClick={() => setIsInviteMember(true)}>Invite</Button>
                            
                            <Button type="text" onClick={() => leaveRoom()}>
                                <span className="ant-btn-icon">
                                    <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" class="x19dipnz x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"><g fill-rule="evenodd" transform="translate(-446 -398)"><g fill-rule="nonzero"><path d="M105 220.75v2.855a.9.9 0 0 1-.895.895h-9.71a.9.9 0 0 1-.895-.895v-15.21a.9.9 0 0 1 .895-.895h9.71a.9.9 0 0 1 .895.895v3.355a.75.75 0 1 0 1.5 0v-3.355a2.4 2.4 0 0 0-2.395-2.395h-9.71A2.4 2.4 0 0 0 92 208.395v15.21A2.4 2.4 0 0 0 94.395 226h9.71a2.4 2.4 0 0 0 2.395-2.395v-2.855a.75.75 0 1 0-1.5 0z" transform="translate(355 192)"></path><path d="M102.25 217h7.5a.75.75 0 1 0 0-1.5h-7.5a.75.75 0 1 0 0 1.5z" transform="translate(355 192)"></path><path d="M107.324 218.011a.75.75 0 0 0 1.06 1.06l2.292-2.29a.75.75 0 0 0 0-1.061l-2.292-2.292a.75.75 0 0 0-1.06 1.06l1.761 1.762-1.761 1.761z" transform="translate(355 192)"></path></g></g></svg>
                                </span>
                                Leave

                            </Button>
                            
                            <Avatar.Group size={"small"} maxCount={2}>
                                
                                {
                                    members.map(member => <Tooltip key={member.id} title={member.displayName}>
                                                            <Avatar src={member.photoURL}>{member.photoURL? '' : member.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                                                        </Tooltip>
                                                )
                                }

                            </Avatar.Group>
                        </ButtonGroupStyled>
                    )
                    }
                </div>


            
                <div className="messages" ref={messageListRef}>
                    {
                        messages?.map(message =>
                            <Message 
                            key={message.id}
                            text={message.text} 
                            photoURL={message.photoURL} 
                            displayName={message.displayName} 
                            createAt={message.createdAt}
                            senderId={message.uid}
                            uid = {uid}
                            imgUrl={message.img}
                            fileUrl={message.file}
                            />
                        )
                    }
                </div>

                <FormStyled form={form}>
                    <div className="icons" style={{display: 'flex', marginLeft: "1rem", gap:'0.8rem'}}>
                        <div className="imgFile">
                            <label htmlFor="imgFile" >
                                <PictureFilled style={{color: 'blue', fontSize: '1.3rem'}}/>    
                            </label>
                            <input name='imgFile' style={{display: 'none'}} accept="image/*" type="file" id="imgFile" onChange={handleImg}/>
                        </div>

                        <div className="attachFile">
                            <label htmlFor="attachFile" >
                                <LinkOutlined style={{color: 'blue', fontSize: '1.3rem'}}/>    
                            </label>
                            <input style={{display: 'none'}}  type="file" id="attachFile" accept="*" onChange={handleAttachFile}/>
                        </div>

                    </div>

                    <Form.Item name="messages">
                        <Input
                            id="chat"
                            autoFocus
                            placeholder="Type something..."
                            autoSize={{ minRows: 1, maxRows: 6 }}
                            variant='borderless'
                            autoComplete="off"
                            onChange={handleInputChange}
                            onKeyDown={(event) => event.key === 'Enter' && inputValue.trim() && handleOnSubmit() }
                        />
                    </Form.Item>
                    
                    <Button 
                        id="btn-chat" 
                        type="primary" 
                        disabled={!inputValue.trim()} 
                        onClick={handleOnSubmit}  
                        style={{
                            background: 'transparent',
                            border: 'none',
                    }}>
                        <svg className="xsrhx6k" height="20px" viewBox="0 0 24 24" width="20px"><title>Press enter to send</title><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" fill= {inputValue.trim()? '#0000FF' : '#8da4f1' }></path></svg>
                    </Button>
                </FormStyled>
                    </>
                ) : <Alert message="Please choose chat room" type="info" showIcon style={{margin: 5}} closable />
            }
        </Col>
    )
}