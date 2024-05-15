import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns";
import React from "react";
import {FilePdfFilled, FileTextFilled, FileUnknownFilled ,FileWordFilled,FileZipFilled } from '@ant-design/icons';


function formatTimeStamp(time){

    let formatTime = '';
    if(time){
        formatTime = formatRelative(new Date(time * 1000), new Date());
        formatTime = formatTime.charAt(0).toUpperCase() + formatTime.slice(1);
    }

    return formatTime
}



export default function Message({ text,displayName, createAt, photoURL, senderId, uid, imgUrl, fileUrl })
{    
    function getFileExtension(fileUrl) {
        return fileUrl.split('.').pop();
    }

    let icon = ""
    switch (getFileExtension(text.split("\n")[0])) {
        case "zip":
        case "rar":
            icon = <FileZipFilled />;
            break;
        case "doc":
        case "docx":
            icon = <FileWordFilled />;
            break;
        case "pdf":
            icon = <FilePdfFilled />;
            break;
        case "txt":
            icon = <FileTextFilled />;
            break;
        default:
            icon = <FileUnknownFilled />;
            break;
    }
    
    

    const firstLine = text.split("\n")[0];
    const maxLineLength = 20; 

    let formattedFirstLine = firstLine;
    if (formattedFirstLine.length > maxLineLength) {
        formattedFirstLine = formattedFirstLine.substring(0, maxLineLength - 15) + "...";
        const secondComponent = firstLine.split(/[_\-. ]+/);
        formattedFirstLine = formattedFirstLine + (secondComponent[secondComponent.length - 2].length < 5?  secondComponent[secondComponent.length - 2] :  secondComponent[secondComponent.length - 2].substring(0,5)) + "." +  secondComponent[secondComponent.length - 1];

    }

    return (
        <div
            className={`message ${senderId === uid && "owner"}`}
        >
            <div className="messageInfo">
                <div className="header">
                    <Avatar  className="avatar" size={"small"} src={photoURL}>{photoURL? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                    <Typography.Text className="author" >{displayName}</Typography.Text>
                </div>
                <span className="date">{formatTimeStamp(createAt?.seconds)}</span>
            </div>

            <div className="messageContent">
                {imgUrl &&  <a href={imgUrl}  style={{width: '75%'}}  ><img src={imgUrl}  style={{width: '100%'}} alt=""/></a> }
                {!fileUrl && text !== "" && <p>{text}</p>}

                {fileUrl && <a className="fileText" href= {fileUrl}> 
                                <div style={{width: '20%', fontSize: '2.5rem', marginRight: '10px'}}>
                                    {icon}
                                </div>

                                <div>
                                    <div style={{fontWeight: 'bold'}}>

                                        {formattedFirstLine}
                                    </div>
                                    <br />
                                    <div style={{fontSize: '0.7rem', marginTop: '-0.6rem'}}>{text.split("\n")[1]}</div>

                                </div>
                            </a>
                }
            </div>
        </div>
    )
}