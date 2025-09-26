export function myReducer(state, action) {
    switch (action.type) {
        case "SET_TOKEN":
            return { ...state, token: action.payload }

        case "SET_ALL_PRODUCTS":
            return { ...state, all_product: action.payload };

        case "SET_RECENT_POSTS":
            return { ...state, recentPosts: action.payload };

        case "SET_VIEWS":
            return { ...state, views: { ...state.views, [action.payload.id]: action.payload.views } };

        case "SET_IMAGES":
            return {
                ...state,
                images: Array.isArray(action.payload)
                    ? action.payload.map(img => ({
                        image_url: img.image_url || img,
                        descriptions: img.descriptions || ""
                    }))
                    : []
            };

        case "ADD_PRODUCT":
            return {
                ...state, all_product: [...state.all_product, action.payload]
            }

        case "UPDATE_PRODUCT":
            return {
                ...state,
                all_product: state.all_product.map((p) => p.id === action.payload?.id ? { ...p, ...action.payload } : p)
            }

        case "SET_POSTS_BY_CATEGORY":
            return {
                ...state,
                postsByCategory: {
                    ...state.postsByCategory,
                    [action.category]: action.payload
                }
            };

        case "SET_CATEGORIES":
            return { ...state, categories: action.payload };

        case "SET_COMMENTS":
            return { ...state, comments: action.payload };

        case "SET_POST":
            return { ...state, post: action.payload.post, images: action.payload.images };

        case "SET_USER_LOGGED_IN":
            return { ...state, isUserLogedIn: action.payload };

        default:
            return state;
    }
}