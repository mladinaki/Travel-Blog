import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyContext from '../context/Context';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import Mostread from '../Mostread/Mostread';
import 'bootstrap/dist/css/bootstrap.min.css';
import Comment from '../page/Comment/Comment';
import './Details.css';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Details = () => {
    const { id } = useParams();
    const { token, url, fetchComments, images, comments, post, getListId, isUserLogedIn } = useContext(MyContext);
    const firstComment = useRef(null)

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const showOpen = () => handleShow();
    const showClose = () => handleClose();
    const [likedData, setLikedData] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    const tokens = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");

    useEffect(() => {
        if (tokens) {
            try {
                const dekodeToken = jwtDecode(tokens);
                setCurrentUser(dekodeToken);
            } catch (error) {
                console.error("Грешка при декодиране на токена:", error);
            }
        }
    }, [tokens]);

    useEffect(() => {
        if (id) fetchComments(id);
        getListId(id);

    }, [id, url, token]);

    const fetchLikeComment = async () => {
        try {
            const tempLikedData = {};

            if (token) {
                const res = await axios.post(`${url}/comment/like-status`, { post_id: id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setLikedData(res.data);
            } else {
                for (const comment of comments) {
                    const res = await axios.get(`${url}/comment/like-count/${comment.id}`);
                    tempLikedData[comment.id] = { liked: false, count: res.data.count };
                }
                setLikedData(tempLikedData);
            }
        } catch (error) {
            console.error("Грешка при зареждане на лайковете", error);
        }
    };

    useEffect(() => {
        if (comments.length > 0) {
            fetchLikeComment();
        }
    }, [comments, token]);

    const toggleLike = (commentId) => {
        if (!token) {
            toast.info("Моля, влезте в профила си, за да харесате коментар.");
            return;
        }

        setLikedData(prev => {
            const current = prev[commentId];
            if (!current) return prev;

            const liked = !current.liked;
            const count = liked ? current.count + 1 : current.count - 1;

            return {
                ...prev,
                [commentId]: {
                    liked,
                    count
                }
            };
        });

        axios.post(`${url}/comment/like/${commentId}`, { post_id: id }, { headers: { token } })
            .catch(() => toast.error("Грешка при харесване."));
    };

    const onDeleteComment = async (commentId) => {
        const isConfirmed = window.confirm("Сигурни ли сте, че искате да изтриете коментара?");

        if (isConfirmed) {
            try {
                await axios.delete(`${url}/comment/addComment/delete-comment/${commentId}`, { headers: { token } })
                toast.success("Коментарът е изтрит успешно!");
            } catch (error) {
                console.error("Грешка при изтриване на коментара:", error);
            }
        }
        fetchComments(id);
        handleClose();
    }

    return (
        <div className="container mt-5 px-5">
            <div className="row">
                {/* Лява колона – статия + коментари */}
                <div className="col-md-8">
                    <div className="mb-3">
                        {post && (
                            <>
                                <Card.Title
                                    className="text-start mb-1 fs-4 text-dark"
                                    style={{ maxWidth: '100%', textWrap: 'balance' }}
                                >
                                    {post.title}
                                </Card.Title>

                                <Image
                                    src={`${url}/uploads/${post.coverImage}`}
                                    className="img-fluid p-3 rounded-5"
                                    alt="Cover"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                />

                                <div className="text-start fs-5" style={{ maxWidth: '100%' }}>
                                    <strong>{post.description.slice(0, 100)}</strong>{post.description}
                                </div>

                                {images.map((image, i) => (
                                    <div key={i} className="row">
                                        <img
                                            src={`${url}/uploads/${image.image_url}`}
                                            className="img-fluid rounded-5 p-3"
                                            alt={image.image_url}
                                            style={{ maxWidth: "100%", height: "auto" }}
                                        />
                                        <div className="text-muted text-start mt-2" style={{ maxWidth: '100%' }}>
                                            <strong className='fs-5'>{image.descriptions.slice(0, 100)}</strong>{image.descriptions}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                    </div>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        centered
                        size="lg"
                    >
                        <Modal.Header closeButton>
                            {isUserLogedIn && (
                                <p className='fs-5 text-center w-100' style={{ fontWeight: 'bold', color: '#333', fontFamily: "arial" }}>
                                    Добави коментар
                                </p>
                            )}
                        </Modal.Header>
                        <Modal.Body>
                            <Comment
                                userId={userId}
                                token={token}
                                postId={id}
                                onCommentAdded={() => {
                                    fetchComments(id);
                                    handleClose();

                                    setTimeout(() => {
                                        if (firstComment.current) {
                                            firstComment.current.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }, 300)
                                }}
                            />
                        </Modal.Body>

                    </Modal>

                    <strong style={{ color: "#027E88" }}>Добави коментар</strong>
                    <i
                        className="bi bi-chat-dots-fill fs-4 p-3"
                        onClick={handleShow}
                        title="Добави коментар"
                        style={{ cursor: 'pointer' }}
                    ></i>

                    {comments.length === 0 && (
                        <p className="commentsLength text-center">Няма коментари към тази публикация.</p>
                    )}

                    {comments.map((comment, i) => {
                        const isFirst = i === 0;
                        return (
                            <div key={i} ref={isFirst ? firstComment : null}>
                                <div className="col-md-12 count-comment mb-2 pb-2 shadow-sm p-3 rounded-3">
                                    <div className="card-body">
                                        <div className="comment-header">
                                            <div className="text-start">
                                                <i className="bi bi-person-circle fs-4 text-muted me-4"></i>
                                                <span className='title-publication'>
                                                    <p className="author fw-bold mb-1" style={{ fontSize: '15px' }}>{comment.user?.username}</p>
                                                    <small className="text-muted">
                                                        {new Date(comment.createdAt).toLocaleString('bg-BG', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }).replace('г.', '')}
                                                    </small>
                                                </span>
                                            </div>
                                        </div>

                                        <p className="comment-text mb-2" style={{ fontSize: '14px', lineHeight: '1.4' }}>{comment.text}</p>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted"></small>

                                            {currentUser && currentUser.id === comment.user_id && (
                                                <i
                                                    className="bi bi-trash text-danger ms-2"
                                                    style={{ cursor: 'pointer', fontSize: '16px' }}
                                                    onClick={() => onDeleteComment(comment.id)}
                                                ></i>
                                            )}
                                        </div>

                                        <div className="mt-1">
                                            <span
                                                onClick={() => toggleLike(comment.id)}
                                                style={{
                                                    fontSize: '14px',
                                                    cursor: token ? 'pointer' : 'default'
                                                }}
                                            >
                                                <i
                                                    className={likedData[comment.id]?.liked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"}
                                                    style={{ color: likedData[comment.id]?.liked ? 'red' : 'gre' }}
                                                ></i>
                                                {" "}
                                                {likedData[comment.id]?.count || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


                <div className="col-md-4">
                    <Mostread />
                </div>
            </div>
        </div>
    );
};

export default Details;


