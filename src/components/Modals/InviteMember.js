import { Avatar, Form, Modal, Select, Spin } from 'antd';
import {AppContext}  from '../../context/AppProvider';
import React, { useContext, useState } from 'react';
import { debounce } from 'lodash';
import {db} from '../../firebase/config'

function DebounceSelect({fetchOptions, debounceTimeout = 300,curMembers, ...props}){
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);


    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    React.useEffect(() => {
        return () => {
          // clear when unmount
          setOptions([]);
        };
      }, []);

    return(
        <Select 
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
        >
            {
                // [{label, value, photoURL}]
                options.map((opt) => (

                    <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                        <Avatar size="small" src={opt.photoURL}>
                            {opt.photoURL? '' : opt.label?.charAt(0)?.toUpperCase()}    
                        </Avatar>

                        {`${opt.label}`}

                    </Select.Option>
                    )
                )
            }
        </Select>
    )
}


async function fetchUserList(search, curMembers){

    return db
    .collection('users')
    .where('keywords', 'array-contains', search)
    .orderBy('displayName')
    .limit(20)
    .get()
    .then(snapshot => {
        return snapshot.docs
            .map((doc) => ({
                label: doc.data().displayName,
                value: doc.data().uid,
                photoURL: doc.data().photoURL
            }))
            .filter(opt => !curMembers.includes(opt.value));
    });
}

const InviteMember = () => {

    const {isInviteMember, setIsInviteMember, selectedRoomId, selectedRoom} = useContext(AppContext);

    const [value, setValue] = useState();
    const [form] = Form.useForm();
    
    const handleOk = () => {
        form.resetFields();
        setValue([]);

        const roomRef = db.collection('rooms').doc(selectedRoomId);

        if(value === undefined || value === ''){
            alert("User not found!")
        }
        else{
            roomRef.update({
                members: [...selectedRoom.members, ...value.map(val => val.value)],
    
            });
            setIsInviteMember(false)
        }
    }

    const handleCancel = () => {
        form.resetFields();
        setValue([]);

        setIsInviteMember(false)
    }


    return (
        <div>
            <Modal title="Add member" open={isInviteMember} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout='vertical'>
                    
                    <DebounceSelect 
                        mode='multiple'
                        name='search-user'
                        label='Name members'
                        value={value}
                        placeholder='Enter member name'
                        fetchOptions={fetchUserList}
                        onChange={newValue => setValue(newValue)}
                        style={{width: '100%'}}
                        curMembers={selectedRoom.members}
                    />

                </Form>
            </Modal>
        </div>
    );
}

export default InviteMember;
