import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Allproduct.css';
import { Image, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Category from '../../Category/Category';

const Allproduct = ({ url, token }) => {
    const [product, setProduct] = useState([]);
    const [filterProduct, setFilterProduct] = useState([]);
    const [filters, setFilters] = useState({ category: "", subCategory: "" });
    const [visibleCard, setVisibleCard] = useState({});
    const [post, setPost] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const toggleTheme = () => setDarkMode(prev => !prev);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${url}/add/get`, { headers: { token } });
            const data = response.data.map(post => ({
                ...post,
                category: post.category ? post.category.categoryName : "",
                subCategory: post.subCategory ? post.subCategory.subCategoryName : "",
                is_verified: post.is_verified
            }));

            setProduct(data);
            setFilterProduct(data);
            setPost(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [url]);

    useEffect(() => {
        const filtered = product.filter((p) => {
            const selectedCategory = filters.category?.name || "";
            const selectedSubCategory = filters.subCategory?.name || "";

            const categoryFilter = !selectedCategory || (p.category?.toLowerCase() === selectedCategory.toLowerCase());
            const subCategoryFilter = !selectedSubCategory || (p.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase());

            return categoryFilter && subCategoryFilter;
        });

        setFilterProduct(filtered);
    }, [filters, product]);

    const showCard = (id) => setVisibleCard(prev => ({ ...prev, [id]: !prev[id] }));
    const verifyPost = async (id) => {
        try {
            await axios.put(`${url}/add/verify/${id}`, {}, { headers: { token } });
            setPost(post.map(p => p.id === id ? { ...p, is_verified: true } : p));
            setFilterProduct(prev => prev.map(p => p.id === id ? { ...p, is_verified: true } : p));
            toast.success('Публикацията е верифицирана');
        } catch (err) { toast.error('Неуспешно верифициране'); }
    }

    const onDeletePost = async (postId) => {
        if (!window.confirm('Сигурни ли сте, че искате да изтриете този пост?')) return;
        try {
            const response = await axios.delete(`${url}/add/remove/post/${postId}`, { headers: { token } });
            if (response.data.success) {
                setProduct(prev => prev.filter(p => p.id !== postId));
                setPost(prev => prev.filter(p => p.id !== postId));
                setFilterProduct(prev => prev.filter(p => p.id !== postId));
                toast.success('Успешно изтриване на пост');
            }
        } catch (err) { toast.error('Неуспешно изтриване'); }
    }

    return (
        <div className="sidebar-container">
            {/* Sidebar */}

            {/* Main content */}
            <div className={`main-content ${darkMode ? 'dark-mode' : ''}`}>
                <button onClick={toggleTheme} className="toggle-theme">
                    {darkMode ? 'Светла тема' : 'Тъмна тема'}
                </button>
                <h2 className="mb-4">Всички продукти</h2>
                <div className="mb-4 w-70">

                    <Category onCategoryChange={(newFilter) => setFilters(prev => ({ ...prev, ...(newFilter ?? {}) }))} />
                </div>

                <div className="card-container">
                    {filterProduct.length > 0 ? filterProduct.map((item) => (
                        <div className="card-wrapper" key={item.id}>
                            <div className="card shadow-sm">
                                <Link to={`/details/${item.id}`}>
                                    <Image src={`${url}/uploads/${item.coverImage}`} className="card-img-top" style={{ height: "10rem", objectFit: 'cover' }} />
                                </Link>

                                <h3 className="card-title">{item.title}</h3>
                                <div className="card-meta">
                                    {new Date(item.createdAt).toLocaleDateString('bg-BG')}
                                </div>

                                <p className="card-text">
                                    Категория: <span className="category-item">{item.category || 'Не е зададена категория'}</span>
                                </p>
                                <p className="card-text">
                                    Подкатегория: <span className="subcategory-item">{item.subCategory || 'Не е зададена подкатегория'}</span>
                                </p>

                                {visibleCard[item.id] && (
                                    <p>{item.description.slice(0, 100)}<Link to={`/details/${item.id}`}> ...[виж още]</Link></p>
                                )}

                                <Button onClick={() => showCard(item.id)} className="btn btn-dark btn-sm">
                                    {visibleCard[item.id] ? "скрий" : "Прегледай"}
                                </Button>

                                <Button onClick={() => verifyPost(item.id)}
                                    className={`btn btn-sm ${item.is_verified ? 'btn-dark' : 'btn-danger'}`}
                                    disabled={item.is_verified}
                                >
                                    {item.is_verified ? 'проверен' : 'одобри пост'}
                                </Button>

                                <div className="card-footer">
                                    <div onClick={() => onDeletePost(item.id)} className="delete-btn"><i className="bi bi-trash3"></i></div>
                                    <div className="edit-btn"><Link to={`/edit/post/${item.id}`}><i className="bi bi-pencil"></i></Link></div>
                                </div>
                            </div>
                        </div>
                    )) : <p className="no-products">Няма намерени продукти!</p>}
                </div>
            </div>
        </div>
    );
}

export default Allproduct;
