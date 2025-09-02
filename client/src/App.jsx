import { Route, Routes } from 'react-router-dom';
import './App.css';
import { MyContextProvider } from './component/context/Context';
import Details from './component/Details/Details';
import Home from './component/Home/Home';
import Login from './component/Login/Login';
import Category from './component/page/Category/Category';
import { ToastContainer } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import About from './component/Popular/About/About';
import NavigateBar from './component/Navigate/NavigateBar';


function App() {
  return (
    <div>
      <MyContextProvider>
        <NavigateBar/>
        <ToastContainer />
        <Routes>
          <Route path='/about' element={<About />} />
          <Route path='/details/:id' element={<Details />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/login' element={<Login />} />
          <Route path='/blog' element={<Home />} />
        </Routes>
      </MyContextProvider>
    </div>
  )
}

export default App
