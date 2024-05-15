import React from "react";
import UserInfo from "./UserInfo";
import RoomList from "./RoomList";
import { Col } from 'antd';

export default function Sidebar({handleRoomClick, isHidden})
{
    return (
        <Col span={8} className={`sidebar ${isHidden ? 'sidebar-hidden' : ''}`}>
            <UserInfo />
            <RoomList
                handleRoomClick={handleRoomClick}
            />
        </Col>
    );
}