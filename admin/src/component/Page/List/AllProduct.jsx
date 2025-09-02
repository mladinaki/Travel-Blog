import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import './Allproduct.css';
import { Image } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Category from '../../Category/Category';

const Allproduct = ({ url, token }) => {
    
    const [product, setProduct] = useState([]);
    const [filterProduct, setFilterProduct] = useState([]);
    const [filters, setFilters] = useState({ category: "", subCategory: "" });
    const [visibleCard, setVisibleCard] = useState({});
    const [post, setPost] = useState([]);

    const fetchProduct = async () => { 

        try {
            const response = await axios.get(`${url}/add/get`,{headers: { token }});
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

    const showCard = (id) => {
        setVisibleCard((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    }

    const verifyPost = async (id) => {
        try {
            await axios.put(`${url}/add/verify/${id}`, {}, {headers: {token}});

            setPost(post.map(post => (post.id === id ? { ...post, is_verified: true } : post)));

            toast.success('Публикацията е верифицирана');
        } catch (error) {
            console.error('Грешка при верифициране', error);
            toast.error('Неуспешно врифициране на поста')
        }
    }

    const onDeletePost = async (postId) => {

        if (!window.confirm('Сигурнили сте че искате да изтриете този пост')) return
        try {
            const response = await axios.delete(`${url}/add/remove/post/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProduct(prev => prev.filter((post) => post.id !== postId));
                setPost(prev => prev.filter(post => post.id !== postId));
                toast.success('Успешно изтриване на пост');
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete the post.");
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [url])

    useEffect(() => {
        const filtered = product.filter((p) => {
            const selectedCategory = filters.category?.name || "";
            const selectedSubCategory = filters.subCategory?.name || "";

            const categoryFilter = !selectedCategory || (
                p.category && typeof p.category === "string" &&
                p.category.toLowerCase() === selectedCategory.toLowerCase()
            );

            const subCategoryFilter = !selectedSubCategory || (
                p.subCategory && typeof p.subCategory === "string" &&
                p.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()
            );
            return categoryFilter && subCategoryFilter;
        });

        setFilterProduct(filtered);
    }, [filters, product]);

    return (
        <div className="crad-container">
            <div className="row p-2 w-100 border"  >
                <div className='row'>
                    <Category
                        onCategoryChange={(newFilter) => {
                            setFilters(prev => ({ ...prev, ...(newFilter ?? {}) }));
                        }}
                    />
                </div>

                {filterProduct.length > 0 ? filterProduct.map((item, i) => (
                    <div className="col col-auto pt-2 mb-1 d-flex" key={item.id} >
                        <div className="row p-2 border ms-0 shadow-sm" style={{ width: "18rem", borderRadius: '5px' }}>

                            <div className="card-body">
                                { }
                                <div>
                                    <Link to={`/details/${item.id}`}><Image src={`${url}/uploads/` + item.coverImage}
                                        style={{ height: "10rem", objectFit: 'cover' }}
                                        className="card-img-top" alt='img' />
                                    </Link>
                                </div>

                                <h3 className='card-title fs-6 fw-semibold fw-light mt-3' style={{ maxWidth: '350px' }}>{item.title}</h3>
                                <div className="d-flex align-items-center mt-3">
                                    <i className="bi bi-calendar2-plus me-2 " style={{ fontSize: "14px", color: "tomato" }}></i>
                                    <span style={{ color: "#000", fontSize: "14px" }}>
                                        {new Date(item.createdAt).toLocaleDateString('bg-BG', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        }).replace(/\//g, '.')}
                                    </span>
                                </div>
                                {/* <h3 className='card-title fs-5 fw-semibold fw-light text-truncate'>{item.description}</h3>*/}
                                <div className='mt-3' style={{ color: "black" }}>
                                    <p className="card-text mb-1">
                                        <span>Категория:</span>
                                        <span className="category-item ms-1" style={{ fontWeight: "500", color: "tomato", fontSize: "15px" }}>
                                            {item.category || 'Не е зададена категория'}
                                        </span>
                                    </p>

                                    <p className="subcategory-item mb-3" style={{ color: "black" }}>
                                        <span>Подкатегория:</span>
                                        <span className="ms-1" style={{ color: "tomato" }}>
                                            {item.subCategory || 'Не е зададена подкатегория'}
                                        </span>
                                    </p>
                                </div>

                                {visibleCard[item.id] &&
                                    <p>{item.description.slice(0, 100)}
                                        <span style={{ color: "tomato", fontWeight: '600' }} ><span />
                                            <Link to={`/details/${item.id}`}>
                                                ...[виж още]
                                            </Link>
                                        </span>
                                    </p>}
                                <Button onClick={() => showCard(item.id)}
                                    className='btn btn-dark m-1 mx-1 p-lg-2 text-lowercase fw-bold' style={{ fontSize: "13px" }}>
                                    {visibleCard[item.id] ? "скрий" : "Прегледай"}
                                </Button>

                                <Button onClick={() => verifyPost(item.id)}
                                    className={`btn  m-2 mx-1 p-lg-2 text-lowercase fw-bold   
                                        ${post.find((p) => p.id === item.id)?.is_verified ? 'btn-dark' : 'btn-danger'}`} style={{ fontSize: "13px" }}>
                                    {item.is_verified ? 'проверен' : 'одобри пост'}
                                </Button>

                                <div className="card-footer">
                                    <div onClick={() => onDeletePost(item.id)} className='delete-btn text-danger'>
                                        <i className="bi bi-trash3"></i>
                                    </div>
                                    <div className='edit-btn'>
                                        <Link to={`/edit/post/${item.id}`} className="text-primary">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )) : <p className='fs-5 d-flex align-items-center justify-content-center' style={{ height: " 60vh" }}>Няма намерени продукти!</p>}
            </div>
        </div >
    )
}

export default Allproduct



