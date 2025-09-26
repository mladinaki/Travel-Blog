import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "./Context"
const TestComponent = () => {
    const {
        all_product,
        getAllProduct,
        postsByCategory,
        getByCategories,
        fetchComments,
        commentSubmited,
        categories,
        fetchCategory,
        mostReadView,
        getListId,
        isUserLogedIn,
    } = useContext(MyContext);

    const [postIdForComments, setPostIdForComments] = useState(null);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        getAllProduct();
        fetchCategory();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Ръчно тестиране на MyContextProvider</h1>

            <h2>Продукти:</h2>
            {all_product && all_product.length > 0 ? (
                all_product.map((p) => (
                    <div key={p.id}>
                        {p.title} | Views: {p.views || 0}{" "}
                        <button onClick={() => mostReadView(p.id)}>+1 View</button>
                        <button onClick={() => setPostIdForComments(p.id)}>Коментари</button>
                    </div>
                ))
            ) : (
                <p>Няма продукти</p>
            )}

            <h2>Категории:</h2>
            {categories && categories.length > 0 ? (
                categories.map((c) => (
                    <div key={c.id}>
                        {c.categoryName}{" "}
                        <button onClick={() => getByCategories(c.categoryName)}>
                            Покажи постове
                        </button>
                    </div>
                ))
            ) : (
                <p>Няма категории</p>
            )}

            <h2>Постове по категории:</h2>
            {Object.keys(postsByCategory).map((cat) => (
                <div key={cat}>
                    <h3>{cat}</h3>
                    {postsByCategory[cat]?.map((p) => (
                        <div key={p.id}>{p.title}</div>
                    ))}
                </div>
            ))}

            <h2>Коментари за пост {postIdForComments}:</h2>
            {postIdForComments && (
                <div>
                    <input
                        type="text"
                        placeholder="Текст на коментар"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                        onClick={() =>
                            commentSubmited({
                                postId: postIdForComments,
                                userId: 1,
                                text: commentText,
                                username: "Тест Потребител",
                                onCommentAdded: () => setCommentText(""),
                            })
                        }
                    >
                        Добави коментар
                    </button>
                    <button onClick={() => fetchComments(postIdForComments)}>
                        Зареди коментари
                    </button>
                </div>
            )}

            <h2>Статус на логнат потребител:</h2>
            <p>{isUserLogedIn ? "Логнат" : "Не е логнат"}</p>

            <h2>Тест getListId:</h2>
            <button onClick={() => getListId(all_product[0]?.id)}>Вземи пост с ID 1</button>
        </div>
    );
};

export default TestComponent;
