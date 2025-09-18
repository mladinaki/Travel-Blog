import { useContext, useEffect, useState } from "react";
import MyContext from "../../context/Context";
import './Comment.css';

const Comment = ({ postId, userId, onCommentAdded }) => {
    const { token, commentSubmited } = useContext(MyContext);
    const [commentText, setCommentText] = useState("");
    const [userIdFromStorage, setUserIdFromStorage] = useState("");
    const [userIdFromStorageName, setUserIdFromStorageName] = useState("");
    const [isUserLogedIn, setUsertLogetIn] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedUserName = localStorage.getItem("username");

        if (token && storedUserId && storedUserName) {
            setUserIdFromStorage(storedUserId);
            setUserIdFromStorageName(storedUserName);
            setUsertLogetIn(true);

        } else {
            setUsertLogetIn(false);
        }
    }, [token]);

    if (!isUserLogedIn) {
        return <p style={{
            color: "red",
            fontWeight: '500',
            textAlign: "center",
            paddingTop: 20
        }}>Моля, влезте в акаунта си, за да можете да добавяте коментари.</p>;
    }

    const handleSubmited = async (e) => {
        e.preventDefault();

        const finalUserId = userId || userIdFromStorage;
        const finalUserName = userIdFromStorageName || 'Неизвестен';

        if (!commentText || !postId || !finalUserId) {
            alert("Моля, попълнете всички полета!");
            return;
        }
        await commentSubmited({
            postId,
            userId: finalUserId,
            text: commentText,
            username: finalUserName,
        })

        if (onCommentAdded) {
            onCommentAdded();
        }
        setCommentText("");
    };

    return (
        <div>
            <div className="mb-1">
                <h3 style={{ fontSize: '19px', fontWeight: '500', color: '#333', fontFamily: "arial" }}>Сподели своето мнение</h3>
            </div>
            <form onSubmit={handleSubmited}>
                <textarea className="p-2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Kоментар...*"
                    required
                    style={{ width: '100%', minHeight: '100px',border:"1px solid silver", fontSize: 16, fontFamily: "arial",borderRadius:5 }}
                />
                <button type="submit" className="btn-comment mt-2" >Kоментирай</button>
            </form>
        </div>
    );
};

export default Comment;
