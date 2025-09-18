import React, { useState, useCallback } from 'react';
import './sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import classNames from 'classnames';

const Sidebar = () => {
    const location = useLocation();
    const [sidebar, setSidebar] = useState(false);

    // Управление на sidebar-а
    const toggleSidebar = useCallback(() => setSidebar(prev => !prev), []);

    return (
        <div className={`sidebar-container ${sidebar ? "collapsed" : ""}`}>
            {/* Sidebar Menu */}
            <div className="sidebar bg-dark">
                <span
                    className="toggle-btn text-white fs-2 d-flex justify-content-center align-items-center cursor-pointer"
                    onClick={toggleSidebar}>
                    <i className="bi bi-list mx-1"></i>
                    {!sidebar && <span className="ms-1 sidebar-menu">Start Menu</span>}
                </span>
                <hr className="text-white" />

                <div className="nav-menu">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link
                                to="/addproduct"
                                className={classNames('nav-link text-white d-flex align-items-center p-2', { 'active': location.pathname === "/addproduct" })}>
                                <i className="fs-6 bi bi-arrow-down-square-fill me-2"></i>
                                {!sidebar && <span>Добавяне</span>}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="/allproduct"
                                className={classNames('nav-link text-white d-flex align-items-center p-2', { 'active': location.pathname === "/allproduct" })}>
                                <i className="fs-6 bi bi-database-add me-2"></i>
                                {!sidebar && <span>Продукти</span>}
                            </Link>
                        </li>
                    </ul>

                </div>

                <hr className="text-white" />

                {/* Dropdown Menu */}
                <Dropdown className='cont-dropdown'>
                    <Dropdown.Toggle variant="dark" id="dropdown-basic" className="d-flex align-items-center">
                        <i className="bi bi-person fs-5"></i>
                        {!sidebar && <span>Моят профил</span>}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='mx-2'>
                        <Dropdown.Item as={Link} to="/mainprofile" className='fs-6'>
                            <i className="bi bi-person me-2"></i>
                            <span>Моят профил</span>
                        </Dropdown.Item>

                        <Dropdown.Item
                            className='fs-6'
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.reload();
                            }}>
                            <i className="bi bi-box-arrow-right me-2"></i>
                            <span>Изход</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}

export default Sidebar;
