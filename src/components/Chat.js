import { LogoutOutlined, SendOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Input, List, Typography, message as antMessage } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import API from '../utils/api';
import { logout } from '../utils/auth';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const userName = localStorage.getItem("username");
    const chatBoxRef = useRef(null);
    console.log("<<<<<<<<<chatLog>>>>>>>>>", chatLog);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatLog]);

    const sendMessage = async () => {
        if (message.trim() && !loading) {
            setLoading(true);
            try {
                const res = await API.post('/chat', { message });
                console.log(loading)
                setChatLog(prev => [...prev, { user: message, bot: res.data.reply }]);
                setMessage('');

            } catch (error) {
                if (error.response) {
                    antMessage.error(error.response.data.message || 'Server Error');
                } else if (error.request) {
                    antMessage.error('No response from server. Please try again.');
                } else {
                    antMessage.error('Something went wrong. Please try later.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogout = () => {
        logout();
    };

    const items = [
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined style={{ color: 'red' }} />,
            onClick: handleLogout,
        },
    ];

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
                <div style={styles.headerLeft}>
                    <img src="/ChatBuddy.png" alt="ChatBuddy" style={{ height: '30px', width: '30px' }} />
                    <span style={styles.chatName}>ChatBuddy</span>
                </div>
                <div style={styles.headerRight}>
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Avatar style={styles.avatar}>
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Dropdown>
                </div>
            </div>

            <div ref={chatBoxRef} style={styles.chatMessagesContainer}>
                <List
                    dataSource={chatLog}
                    renderItem={(item, index) => (
                        <List.Item key={index} style={{ padding: '10px 0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <div style={styles.userMessageBubble}>
                                    <Typography.Text strong>You:</Typography.Text> {item.user}
                                </div>
                                <div style={styles.botMessageBubble}>
                                    <div style={styles.botCardHeader}>
                                        <span style={styles.botName}>Bot</span>
                                    </div>
                                    <div
                                        style={styles.botResponse}
                                        contentEditable="false"
                                        dangerouslySetInnerHTML={{
                                            __html: (() => {
                                                const lines = item.bot.split('\n');
                                                let inCodeBlock = false;
                                                let codeBlockLang = '';
                                                let currentCode = '';
                                                let html = '';

                                                lines.forEach(line => {
                                                    if (line.trim().startsWith('```')) {
                                                        if (!inCodeBlock) {
                                                            // Start of code block
                                                            inCodeBlock = true;
                                                            codeBlockLang = line.trim().slice(3); // e.g., "bash", "js"
                                                            currentCode = '';
                                                        } else {
                                                            // End of code block
                                                            inCodeBlock = false;

                                                            html += `
                                                                <div style="background: white; padding: 12px 16px;box-shadow: skyblue 0px 0px 12px; border-radius: 12px; position: relative; margin-bottom: 10px;">
                                                                    <button onclick="navigator.clipboard.writeText(\`${currentCode.replace(/`/g, '\\`')}\`);window.dispatchEvent(new CustomEvent('copied'))"
                                                                        style="position: absolute; top: 8px; right: 8px; border: none; background: transparent; cursor: pointer;">
                                                                        📋
                                                                    </button>
                                                                    <pre style="margin: 0; white-space: pre-wrap;"><code>${currentCode}</code></pre>
                                                                </div>
                                                            `;
                                                        }
                                                    } else if (inCodeBlock) {
                                                        currentCode += `${line}\n`;
                                                    } else {
                                                        // Normal content formatting
                                                        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                                        line = line.replace(/`([^`]+)`/g, '<code>$1</code>');
                                                        line = line.replace(/\[([^\]]+)\]\((http[^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
                                                        html += `<p>${line}</p>`;
                                                    }
                                                });

                                                return html;
                                            })()
                                        }}

                                    />
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
        height: '99vh',
        backgroundColor: '#f4f7fc',
        position: 'relative',
        overflow: 'hidden',
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
    avatar: {
        backgroundColor: 'rgb(62 69 76)',
        cursor: 'pointer',
    },
    chatMessagesContainer: {
        flex: 1,
        overflowY: 'auto',
        paddingTop: '70px',
        paddingBottom: '100px',
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    inputField: {
        borderRadius: '20px',
        paddingLeft: '15px',
        height: '50px',
    },
    sendIcon: {
        fontSize: '20px',
    },
    botCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
};

export default Chat;
