import React from "react";

import { Button, Collapse, Typography } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";


import { AppContext } from "../../context/AppProvider";

const {Panel} = Collapse

const PanelStyled = styled(Panel)`
    &&& {
        .ant-collapse-header, p{
            color: white;
        }

        .ant-collapse-content-box{
            padding: 0 40px;
        }

        .addRoom{
            margin-top: 20px;
            color: white;
            padding: 0;
        }
    }
`;


const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-top: 4px
    color: white;
`

export default function RoomList({ handleRoomClick })
{
    
    const {rooms, setIsAddRoomVisible, setSelectedRoomId} = React.useContext(AppContext);
    const handleAddRoom = () => {
        setIsAddRoomVisible(true);
    }



    return (
        <Collapse ghost defaultActiveKey={['1']}>
            <PanelStyled header="Room List" key='1'>
                {rooms.map(room => (
                    
                        <LinkStyled
                            className="roomLink"
                            onClick={() => {
                                setSelectedRoomId(room.id);
                                handleRoomClick && handleRoomClick(); 
                            }}
                            key={room.id}
                        >
                            {room.name}
                        </LinkStyled>
                   
                ))}
                
                <Button type="text" icon={<PlusSquareOutlined />} className="addRoom" onClick={handleAddRoom}>
                    Add Room
                </Button>
                
            </PanelStyled>
        </Collapse>
    );
}