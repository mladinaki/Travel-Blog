import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";
import { lists_menu } from "../../assets/assets";
import { io } from "socket.io-client";
import { toast } from 'react-toastify';
import { useReducer } from "react";
import inialStateFunc from "./initialState";
import { myReducer } from "./MyReducer";

export const MyContext = createContext();
export const MyContextProvider = (props) => {

    const socketRef = useRef(null);
    let url = 'http://localhost:3500';

    const [postsByCategory, setPostsByCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [isUserLogedIn, setUsertLogetIn] = useState(false);

    const [state, dispatch] = useReducer(myReducer, {}, inialStateFunc);

    const getAllProduct = async (props) => {
        const config = state.token ? { headers: { token: state.token } } : {};
        try {
            const response = await axios.get(url + `/add/get`, config);
            if (response.data.success || Array.isArray(response.data)) {
                dispatch({ type: 'SET_ALL_PRODUCTS', payload: response.data });
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const mostReadView = async (id) => {
        if (!id) return;
        if (!state.token) {
            console.log('Няма токен,потребителят не е логнат');
        }
        try {
            const response = await axios.put(`${url}/add/getincrement/${id}`, {}, { headers: { token: state.token }, withCredentials: true });

            dispatch({ type: 'SET_VIEWS', payload: { id, views: response.data.views } });

            if (response.data?.recentPosts) {
                dispatch({ type: 'SET_RECENT_POSTS', payload: response.data.recentPosts });
            }

        } catch (error) {
            console.log("Error incrementing views:", error);
        }
    };

    const getRecentPosts = async () => {
        if (!state.token) return;

        try {
            const response = await axios.get(`${url}/add/getrecent/views`, { headers: { token: state.token } });
            if (response.data) {
                dispatch({ type: 'SET_RECENT_POSTS', payload: response.data.recentPosts });
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
            console.log("Грешка при зареждане на категориите", error);
        }
    };

    const fetchComments = async (id) => {
        try {
            const response = await axios.get(url + `/comment/addComment/${id}`, { headers: { token: state.token } });
            dispatch({ type: 'SET_COMMENTS', payload: response.data.comments });
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
            }, { headers: { token: state.token } });

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
            const response = await axios.get(`${url}/add/get/${id}`, { headers: { token: state.token } });
            const { postDetails, imageDetails } = response.data;
            if (response.data) {
                dispatch({ type: 'SET_POST', payload: { post: postDetails, images: imageDetails } })
            }

            if (state.token) {
                dispatch({ type: 'SET_USER_LOGGED_IN', payload: true });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            dispatch({ type: 'SET_TOKEN', payload: savedToken });
        }
        getAllProduct();
    }, []);

    useEffect(() => {
        if (!state.token) return;

        const socket = io(url, {
            transports: ['websocket'],
            withCredentials: true,
        });
        socketRef.current = socket;
        getRecentPosts();

        socket.on("newPost", (post) => {
            dispatch({ type: "ADD_PRODUCT", payload: post })
        });

        socket.on("update", (updatedPost) => {
            dispatch({ type: "UPDATE_PRODUCT", payload: updatedPost });

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
    }, [state.token]);

    const contextValue = {
        ...state,
        dispatch,
        lists_menu,
        url,
        postsByCategory,
        getByCategories,
        fetchComments,
        commentSubmited,
        getRecentPosts,
        mostReadView,
        getAllProduct,
        fetchCategory,
        categories,
        post: state.post,
        images: state.images,
        getListId, isUserLogedIn
    }
    return (
        <MyContext.Provider value={contextValue}>
            {props.children}
        </MyContext.Provider>
    )
}

export default MyContext