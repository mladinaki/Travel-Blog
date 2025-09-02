import Form from 'react-bootstrap/Form';
import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import './Login.css'

const Login = ({ url, setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');

    const onhendleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!email || !password) {
                return alert('Полетата са задължителни!');
            }

            const response = await axios.post(`${url}/users/admin`, { email, password });

            if (response) {

                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);

                if (response.data.user) {
                    localStorage.setItem('userId', response.data.user.id);
                    if (response.data.user.username) {
                        localStorage.setItem('username', response.data.user.username);
                    }
                } else {
                    console.error("User data is missing from response:", response.data);
                }


                localStorage.setItem('userId', response.data.user.id);
                window.location.replace('/allproduct');
            }

            if (response.data.user.username) {
                localStorage.setItem('username', response.data.user.username);
            } else {
                console.error("Username is missing from response:", response.data);
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='login-container'>
            <h3 className='card-title fs-3 text-center p-1' style={{ color: "tomato", display: "block" }} >Aдмин вход</h3>
            <Form onSubmit={onhendleSubmit}>
                <Form.Group className="form-group-custom mb-1" controlId="formGroupEmail">
                    <Form.Label>Емаил адерс</Form.Label>
                    <Form.Control className="form-control-custom" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Емаил адерс" />
                </Form.Group>

                <Form.Group className="form-group-custom mb-1" controlId="formGroupPassword">
                    <Form.Label>Парола</Form.Label>
                    <Form.Control className="form-control-custom" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Прола" />
                </Form.Group>
                {serverError && <p style={{ color: "red" }}>{serverError}</p>}
                <Button className='btn-login rounded-pill p-2' variant="dark" type="submit">
                    Вход
                </Button>
            </Form>
        </div>
    )
}

export default Login
