import { Form, Input, Modal } from 'antd';
import {AppContext}  from '../../context/AppProvider';
import React, { useContext } from 'react';
import {addDocument} from '../../firebase/services'
import { AuthContext } from '../../context/AuthProvider';

const AddRoom = () => {

    const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext);
    const {user: {uid}} = useContext(AuthContext);


    const [form] = Form.useForm();
    
    const handleOk = () => {

        console.log(form.getFieldValue().desc)

        if(form.getFieldValue().desc === undefined || form.getFieldValue().desc === "" || form.getFieldValue().name === undefined || form.getFieldValue().name === "")
            alert("Please check room name or description")
        
        else {
            addDocument('rooms',{...form.getFieldsValue(), members: [uid]})
            form.resetFields();
            setIsAddRoomVisible(false)
        }
    }

    const handleCancel = () => {
        form.resetFields();
        setIsAddRoomVisible(false)
    }


    return (
        <div>
            <Modal title="Create Room" open={isAddRoomVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout='vertical'>
                    <Form.Item label="Room Name" name="name">
                        <Input  placeholder='Enter room name'/>
                    </Form.Item>

                    <Form.Item label="Description" name="desc">
                        <Input.TextArea  placeholder='Enter room description'/>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}

export default AddRoom;
