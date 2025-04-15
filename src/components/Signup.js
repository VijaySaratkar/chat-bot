import { Button, Card, Col, Input, message, Row } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { setToken } from '../utils/auth';

const Signup = () => {
    const [data, setData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);  

    const handleSignup = async () => {
        setLoading(true);
        try {
            const res = await API.post('/auth/signup', data);
            setToken(res.data.token);
            localStorage.setItem("username", data.username);
            message.success('Signup Successful');
            setLoading(false);
            window.location.href = '/login'
        } catch (error) {
            setLoading(false);
            message.error('Signup Failed');
        }
    };

    return (
        <div style={styles.container}>
            <Row justify="center" align="middle" style={{ height: '100vh' }}>
                <Col xs={24} sm={18} md={12} lg={8}>
                    <Card title="Sign-Up ChatBuddy" style={styles.card}>
                        <Input
                            placeholder="Username"
                            value={data.username}
                            onChange={(e) => setData({ ...data, username: e.target.value })}
                            style={styles.inputField}
                        />
                        <Input.Password
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            style={{ ...styles.inputField, marginTop: 10 }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSignup}
                            style={styles.signupButton}
                            block
                            loading={loading}
                            disabled={!data.username || !data.password}
                        >
                            Sign Up
                        </Button>
                        <br />
                        <br />
                        Already a member? <Link style={{ cursor: "pointer" }} to='/login' >Login</Link>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f0f2f5',
        padding: '20px',
    },
    card: {
        borderRadius: '12px',
        boxShadow: 'skyblue 0px 0px 19px',
        padding: '20px',
        textAlign: 'center',
        border: 'none',
    },
    inputField: {
        borderRadius: '10px',
        padding: '10px',
        fontSize: '16px',
    },
    signupButton: {
        marginTop: 20,
        borderRadius: '10px',
        padding: '10px',
        fontSize: '16px',
    },
};

export default Signup;
