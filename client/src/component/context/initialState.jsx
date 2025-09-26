const inialStateFunc = () => {  
    const initialState = {
        token: localStorage.getItem("token") || "",
        all_product: [],
        recentPosts: [],
        views: {},
        postsByCategory: {},
        categories: [],
        comments: [],
        post: null,
        images: [],
        isUserLogedIn: false
    }
    return initialState
}

export default inialStateFunc