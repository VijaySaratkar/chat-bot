import { Button, Card, Col, Input, message, Row } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { setToken } from '../utils/auth';

const Login = () => {
    const [data, setData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await API.post('/auth/login', data);
            setToken(res.data.token);
            localStorage.setItem("username", data.username);
            message.success('Login Successful');
            setLoading(false);
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (error) {
            setLoading(false);
            message.error('Invalid credentials');
        }
    };

    return (
        <div style={styles.container}>
            <Row justify="center" align="middle" style={{ height: '100vh' }}>
                <Col xs={24} sm={18} md={12} lg={8}>
                    <Card title="Sign In ChatBuddy" style={styles.card}>
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
                            onClick={handleLogin}
                            style={styles.loginButton}
                            block
                            loading={loading}
                            disabled={!data.username || !data.password}
                        >
                            Sign In
                        </Button>
                        <br />
                        <br />
                        Don’t have a account? <Link to='/signup' style={{ cursor: "pointer" }} > Sign-Up First</Link>
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
    loginButton: {
        marginTop: 20,
        borderRadius: '10px',
        padding: '10px',
        fontSize: '16px',
    },
};

export default Login;
