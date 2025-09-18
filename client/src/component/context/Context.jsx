import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";
import { lists_menu } from "../../assets/assets";
import { io } from "socket.io-client";
import { toast } from 'react-toastify';

export const MyContext = createContext();
export const MyContextProvider = (props) => {

    const socketRef = useRef(null);
    let url = 'http://localhost:3500';

    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [all_product, setAllProduct] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [views, setViews] = useState({})
    const [postsByCategory, setPostsByCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState(null);
    const [images, setImages] = useState([]);
    const [isUserLogedIn, setUsertLogetIn] = useState(false);

    const getAllProduct = async (props) => {
        const config = token ? { headers: { token } } : {};
        try {
            const response = await axios.get(url + `/add/get`, config);
            if (response.data.success || Array.isArray(response.data)) {
                setAllProduct(response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const mostReadView = async (id) => {
        if (!id) return;
        if (!token) {
            console.log('Няма токен,потребителят не е логнат');

        }
        try {
            const response = await axios.put(`${url}/add/getincrement/${id}`, {}, { headers: { token }, withCredentials: true });
            console.log(response.data);

            const updatedViews = response.data.views;

            setViews(prev => ({ ...prev, [id]: updatedViews }));

            if (response.data?.recentPosts) {
                setRecentPosts(response.data.recentPosts);
            }

        } catch (error) {
            console.log("Error incrementing views:", error);
        }
    };

    const getRecentPosts = async () => {
        if (!token) return;

        try {
            const response = await axios.get(`${url}/add/getrecent/views`, { headers: { token } });
            console.log(response.data);

            if (response.data) {
                setRecentPosts(response.data.recentPosts);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getByCategories = async (categoryName) => {
        try {
            const encodeCategoryName = encodeURIComponent(categoryName);
            const response = await axios.get(url + `/category/posts/category/${encodeCategoryName}`);

            setPostsByCategory((prev) => ({
                ...prev,
                [categoryName]: response.data,
            }));
        } catch (error) {
            console.error("Грешка при зареждане на постовете:", error);
        }
    };

    const fetchComments = async (id) => {
        console.log(id);

        try {
            const response = await axios.get(url + `/comment/addComment/${id}`, { headers: { token } });
            setComments(response.data.comments);
        } catch (error) {
            console.error("Грешка при зареждане на коментарите:", error);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`http://localhost:3500/category/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Грешка при зареждане на категориите:", error);
        }
    };

    const commentSubmited = async ({ postId, userId, text, username, onCommentAdded }) => {
        if (!text || !postId || !userId) {
            toast.error("Моля, попълнете всички полета!");
            return;
        }
        try {
            const response = await axios.post(`${url}/comment/addComment`, {
                post_id: postId,
                user_id: userId,
                text,
                username
            }, { headers: { token } });

            if (response.data.success) {
                toast.success("Коментарът е добавен успешно!");
                fetchComments(postId);

                if (onCommentAdded) {
                    onCommentAdded();
                }
            } else {
                alert("Грешка при добавяне на коментар.");
            }
        } catch (error) {
            console.error("Грешка при изпращане на коментара:", error);
        }
    }

    const getListId = async (id) => {
        if (!id) return;

        try {
            const response = await axios.get(`${url}/add/get/${id}`, { headers: { token } });
            const { postDetails, imageDetails } = response.data;
            setPost(postDetails);
            if (Array.isArray(imageDetails)) {
                setImages(imageDetails);
            } else if (imageDetails) {
                setImages([imageDetails]);
            } else {
                setImages([]);
            }

            if (token) {
                setUsertLogetIn(true)
            }
            setImages(Array.isArray(imageDetails) ? imageDetails : []);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
        getAllProduct();
    }, []);

    useEffect(() => {
        if (!token) return;

        const socket = io(url, {
            transports: ['websocket'],
            withCredentials: true,
        });
        socketRef.current = socket;
        getRecentPosts();

        socket.on("newPost", (post) => {
            setAllProduct((prevPosts) => [...prevPosts, post]);
        });

        socket.on("update", (updatedPost) => {
            setAllProduct((prevPosts) =>
                prevPosts.map((p) =>
                    p.id === updatedPost.id ? { ...p, is_verified: updatedPost.is_verified } : p
                )
            );
            setTimeout(() => {
                getAllProduct();
            }, 500);
        });

        socket.on("deletePost", (postDelete) => {
            setAllProduct((prevPosts) => prevPosts.filter((p) => p.id !== postDelete))
        });

        return () => {
            socket.disconnect();
        };
    }, [token]);

    const contextValue = {
        lists_menu,
        url,
        all_product,
        recentPosts,
        postsByCategory,
        getByCategories,
        fetchComments,
        comments,
        commentSubmited,
        getRecentPosts,
        views,
        mostReadView,
        setAllProduct,
        getAllProduct,
        fetchCategory,
        categories,
        setRecentPosts,
        token,
        setToken,
        post,
        images,
        getListId, isUserLogedIn
    }
    return (
        <MyContext.Provider value={contextValue}>
            {props.children}
        </MyContext.Provider>
    )
}

export default MyContext