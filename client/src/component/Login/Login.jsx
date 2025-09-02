import React, { useContext, useState } from 'react'
import './Login.css'
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';
import MyContext from '../context/Context';
import { useNavigate } from 'react-router-dom';
import UseLogin from '../HookLogin/useLogin';
import validateForm from './ValidateLogin';

const LOGIN_MODE = 'Login';
const SIGNUP_MODE = 'Sign Up';
const Login = () => {
    const { url, setToken } = useContext(MyContext);
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState(LOGIN_MODE);
    const [serverError, setServer] = useState('');

    const onSingUp = async (values) => {
        const endpoint = (loginData === LOGIN_MODE ? `${url}/users/login` : `${url}/users/register`);

        try {
            const response = await axios.post(endpoint, values);
            console.log(response.data);

            if (response.data) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.user.id);
                localStorage.setItem('username', response.data.user.username);


                if (response.data.user && response.data.user.id) {
                    localStorage.setItem('userId', response.data.user.id);
                } else {
                    console.error('User ID is missing in response:', response.data.user);
                }

                if (response.data.user.username) {
                    localStorage.setItem('username', response.data.user.username);

                } else {
                    console.error('Username is missing in response:', response.data);
                }
                setTimeout(() => {
                    navigate('/about');
                }, 100);
            }

        } catch (error) {
            setServer(error.response?.data?.message || 'Нещо се обърка или грешна парола')
        }
    };

    const { values, onChange, handleSubmit, errors, isSubmiting } = UseLogin(
        (values) => validateForm(values, loginData), onSingUp);


    const toogleFormMode = () => {
        setLoginData((prev) => (prev === LOGIN_MODE ? SIGNUP_MODE : LOGIN_MODE))
    }

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <h2>Вход</h2>
                {/* Пълно име */}
                {loginData === SIGNUP_MODE && (
                    <div>
                        <label>Име</label>
                        <input onChange={onChange} value={values.username} type='text' name='username' placeholder='Име...' />
                        {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
                    </div>
                )}

                {/* Email */}
                <div>
                    <label>Емайл</label>
                    <input onChange={onChange} name='email' value={values.email} type="text" placeholder='Емайл...' />
                    {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                </div>

                {/* Парола */}
                <div>
                    <label>Парола</label>
                    <input onChange={onChange} type="password" name='password' value={values.password} placeholder='Парола...' />
                    {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                </div>

                {/* Потвърждаване на парола */}
                {loginData === SIGNUP_MODE && (
                    <div>
                        <label>Потвърди парола:</label>
                        <input onChange={onChange} type="password" name='repeatPassword' value={values.repeatPassword} placeholder='Повтори паролата...' />
                        {errors.repeatPassword && <p style={{ color: "red" }}>{errors.repeatPassword}</p>}
                    </div>
                )}
                {serverError && <p style={{ color: "red" }}>{serverError}</p>}
                <Button type="submit" className='rounded-pill  m-3' variant="dark" disabled={isSubmiting}>
                    {isSubmiting ? <Spinner animation="border" size="sm" /> : loginData === SIGNUP_MODE ? 'Create Account' : LOGIN_MODE}
                </Button>

                <span onClick={toogleFormMode} className='bl' style={{ cursor: "pointer", borderBottom: "1px solid black", textAlign: "center", marginTop: "10px" }}>
                    {loginData === LOGIN_MODE ? "Създайте тук" : "Вход"}
                </span>

            </form>
        </div>
    );
}

export default Login
