import { Fragment, useState } from 'react'
import './App.css'
import Login from './component/Login/Login'
import Sidebars from './component/Sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './component/Home/Home';
import Allproduct from './component/Page/List/AllProduct';
import { ToastContainer } from 'react-toastify';
import Details from './component/Details/Details';

import Edit from './component/Page/Edit/Edit';
import AddProduct from './component/Page/Add/AddProduct';
import { useEffect } from 'react';

function App() {
  const url = 'http://localhost:3500';

  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      {token == ''
        ? <Login setToken={setToken} url={url} />
        : <Fragment>
          <div className="app-content">
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Allproduct url={url} token={token} />} />
              <Route path='/details/:id' element={<Details url={url} token={token} />} />
              <Route path='/allProduct' element={<Allproduct url={url} token={token} />} />
              <Route path='/addproduct' element={<AddProduct url={url} token={token} />} />
              <Route path='/edit/post/:id' element={<Edit url={url} token={token} />} />
            </Routes>
          </div>
          <Sidebars />

        </Fragment>
      }
    </>
  )
}

export default App
