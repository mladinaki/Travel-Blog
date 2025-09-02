import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from '../../assets/logo_2.png';
import './Navbar.css';
import { assets } from '../../assets/assets';
import MyContext from '../context/Context';

const NavigateBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('username');
  const { setToken, getAllProduct, fetchCategory, categories } = useContext(MyContext);

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar shadow-sm">
    <img src="https://www.emilyluxton.co.uk/wp-content/uploads/2018/11/Emily-Luxton_logo-smaller.png" alt="Logo" className='logo-img' />
    <Container>
    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
    {/* <span className="brand-title">Blog Todorov</span> */}
    </Navbar.Brand>
    
    <Nav className="me-auto align-items-center">
    <Nav.Link as={Link} to="/about" style={{textTransform:"uppercase"}} className={({ isActive }) => isActive ? 'active-link' : ''}>Начало</Nav.Link>
          <Nav.Link as={Link} to="/blog" style={{textTransform:"uppercase"}} className={location.pathname === '/blog' ? 'active-link' : ''}>Блог</Nav.Link>

          <NavDropdown title="КАТЕГОРИИ" id="nav-dropdown" className="custom-dropdown">
            {categories.length ? (
              categories.map(cat => (
                <NavDropdown.Item key={cat.id} as={NavLink} to={`/category/${cat.categoryName}`} className={({ isActive }) => isActive ? 'active-link' : ''}>
                  {cat.categoryName}
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item>Няма категории</NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>

        <div className="nav-profile">
          {localStorage.getItem('token') ? (
            <div className="profile-menu">
              <span className="welcome-text">Добре дошъл,</span>
              <span className="user-name">{userName || "Потребител"}</span>
              <img src={assets?.user || ''} alt="User" className="user-avatar" />
              <ul className="menu-profile">
                <li onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  setToken('');
                  getAllProduct();
                  navigate('/blog');
                }}>
                  <i className="bi bi-box-arrow-in-right"></i> Изход
                </li>
              </ul>
            </div>
          ) : (
            <Nav.Link as={Link} to="/login" className="login-btn">
              <i className="bi bi-box-arrow-in-right"></i> Вход
            </Nav.Link>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavigateBar;
