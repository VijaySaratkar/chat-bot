import { LogoutOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Input, List, Menu, Typography } from 'antd';
import React, { useState } from 'react';
import API from '../utils/api';
import { logout } from '../utils/auth';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const userName = localStorage.getItem("username")

    const sendMessage = async () => {
        if (message.trim() && !loading) {
            setLoading(true);
            try {
                const res = await API.post('/chat', { message });
                setChatLog([...chatLog, { user: message, bot: res.data.reply }]);
                setMessage('');
            } catch (error) {
                console.error('Chat API error:', error);
                if (error.response) {
                    message.error(error.response.data.message || 'Server Error');
                } else if (error.request) {
                    message.error('No response from server. Please try again.');
                } else {
                    message.error('Something went wrong. Please try later.');
                }
            } finally {
                setLoading(false);
            }
        }
    };


    const handleLogout = () => {
        logout()
    };

    const avatarMenu = (
        <Menu>
            <Menu.Item onClick={handleLogout} icon={<LogoutOutlined color='red' style={{ color: "red" }} />}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
                <div style={styles.headerLeft}>
                    <img src="/ChatBuddy.png" alt="ChatBuddy" style={{ height: '30px', width: '30px' }} />
                    <span style={styles.chatName}>ChatBuddy</span>
                </div>
                <div style={styles.headerRight}>
                    <Dropdown overlay={avatarMenu} trigger={['click']} style={styles.avatarContainer}>
                        <Avatar style={styles.avatar}>{userName.charAt(0).toUpperCase()}</Avatar>
                    </Dropdown>
                </div>
            </div>
            <div style={styles.chatMessagesContainer}>
                <List
                    dataSource={chatLog}
                    renderItem={(item, index) => (
                        <List.Item key={index} style={{ padding: '10px 0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <div style={styles.userMessageBubble}>
                                    <Typography.Text strong>You:</Typography.Text> {item.user}
                                </div>
                                <div style={styles.botMessageBubble}>
                                    <div style={styles.botName}>Bot</div>
                                    <Typography.Text>{item.bot}</Typography.Text>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            <div style={styles.inputContainer}>
                <Input
                    placeholder="Ask me anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={sendMessage}
                    style={styles.inputField}
                    disabled={loading}
                    suffix={
                        <SendOutlined
                            onClick={sendMessage}
                            style={{
                                ...styles.sendIcon,
                                color: loading ? '#cccccc' : '#007bff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        />
                    }
                />
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        backgroundColor: '#f4f7fc',
    },
    chatHeader: {
        fontSize: '24px',
        fontWeight: 'bold',
        padding: '16px',
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: '20px',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
    },
    chatName: {
        marginLeft: '10px',
        fontSize: '20px',
    },
    avatarContainer: {
        cursor: 'pointer',
    },
    avatar: {
        backgroundColor: 'rgb(62 69 76)',
        cursor: 'pointer',
    },
    chatMessagesContainer: {
        flex: 1,
        overflowY: 'auto',
        paddingTop: '60px',
        paddingLeft: '16px',
        paddingRight: '16px',
    },
    userMessageBubble: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '20px',
        maxWidth: '80%',
        wordWrap: 'break-word',
        display: 'inline-block',
        fontSize: '14px',
        marginBottom: '10px',
        alignSelf: 'flex-end',
    },
    botMessageBubble: {
        backgroundColor: '#f1f1f1',
        color: '#333',
        padding: '12px 20px',
        borderRadius: '20px',
        maxWidth: '80%',
        wordWrap: 'break-word',
        display: 'inline-block',
        fontSize: '14px',
        alignSelf: 'flex-start',
        marginBottom: "44px",
    },
    botName: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    inputContainer: {
        padding: '10px',
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    inputField: {
        borderRadius: '20px',
        paddingLeft: '15px',
        height: '40px',
    },
    sendIcon: {
        fontSize: '20px',
        cursor: 'pointer',
    },
};

export default Chat;
