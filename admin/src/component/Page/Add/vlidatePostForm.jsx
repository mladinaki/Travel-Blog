import { toast } from "react-toastify";

const vlidatePostForm = (title, description, category, coverImage, imageUrl) => {
    let newErrors = {};

    if (!category || !category.category?.id) {
        newErrors.category = 'Моля изберете категория';
    }
    if (!category || !category.subCategory?.id) {
        newErrors.subCategory = 'Моля изберете подкатегория';
    }

    if (!title.trim()) {
        toast.error('Името на статията е задължително.');
        return;
    }

    if (!description.trim()) {
        toast.error('Описанието на статията е задължително.');
        return;
    }

    if (!coverImage) {
        toast.error('Трябва да качите корица за статията.');
        return;
    }

    if (imageUrl.length === 0) {
        toast.error('Трябва да добавите поне една снимка.');
        return;
    }
    return newErrors
}

export default vlidatePostForm
