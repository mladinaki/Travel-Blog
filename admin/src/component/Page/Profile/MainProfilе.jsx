import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button ,Container, Form, Spinner } from 'react-bootstrap';

const MainProfile = () => {
  const url = 'http://localhost:3500';

  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  const [user, setUser] = useState({
    username: '',
    email: '',
    online: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Зареждане на профил
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${url}/profile/mainProfile`, { headers: { token } });

        if (res.data) {
          setUser({
            username: res.data.username,
            email: res.data.email,
            online: res.data.online,
          });
        }
      } catch (err) {
        console.error(err.response?.data || err);
        setMessage(err.response?.data?.message || 'Грешка при зареждане на профила.');
      }
    };

    fetchProfile();
  }, [token]);

  const toggleOnline = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.put(
        `${url}/profile/mainProfile-online`,
        { online: !user.online }, { headers: { token } });

      if (res.data.success) {
        setUser(prev => ({ ...prev, online: !prev.online })); // веднага update в UI
        setMessage('Онлайн статусът е обновен успешно!');
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage('Грешка при обновяване на онлайн статуса.');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  }

  const updateProfile = async (e) => {
    e.preventDefault();
    const resposnse = await axios.put(`${url}/profile/mainProfile-update`, { username: user.username, email: user.email }, { headers: { token } });
    console.log(resposnse.data);
    console.log('Update profile clicked');

  }
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
  <Container
  className={`p-4 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
      style={{ minHeight: '100vh' }}
  >

   <button onClick={toggleTheme} className="mb-3">
        {darkMode ? 'Светла тема' : 'Тъмна тема'}
      </button>

    <div className="container mt-4">
      <h2>Моят профил</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Име</Form.Label>
          <Form.Control type="text" name='username' value={user.username} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name='email' value={user.email} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Онлайн статус"
            checked={!!user.online}
            onChange={toggleOnline}
            disabled={loading}
          />
          <span>
            <span
              style={{
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                backgroundColor: user.online ? 'green' : 'red',
                display: 'inline-block',
                marginLeft: '10px',
              }}
            ></span>
          </span>
        </Form.Group>

        {loading && <Spinner animation="border" size="sm" />}
        {message && <p className="mt-2">{message}</p>}
        <button type="button" className="btn btn-primary" onClick={updateProfile} >Запиши</button>
      </Form>
    </div>
  </Container>
  );
};

export default MainProfile;
