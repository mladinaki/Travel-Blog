import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import vlidatePostForm from '../Page/Add/vlidatePostForm';

const useAddUse = (url, token) => {
    const [serverError, setServer] = useState('');
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState({ id: null, name: '' });
    const [subCategory, setSubCategory] = useState({ id: null, name: '' });
    const [coverImage, setCoverImage] = useState(null);
    const [imageUrl, setImageUrl] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [postId, setPostId] = useState(null);
    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!category || !category.category?.id || !category.subCategory?.id) {
            toast.error("Моля изберете категория и подкатегория.");
            setLoading(false);
            return;
        }

        const validateErrors = vlidatePostForm(title, description, category, coverImage, imageUrl);
        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            setLoading(false);
            return;
        }

        const categoryId = category.category?.id || "";
        const subCategoryId = category.subCategory?.id || "";
        const categoryName = category?.category?.name || "";
        const subCategoryName = category?.subCategory?.name || "";

        try {
            const formDataPost = new FormData();
            formDataPost.append('title', title);
            formDataPost.append('description', description);
            formDataPost.append('categoryId', categoryId);
            formDataPost.append('subCategoryId', subCategoryId || null);
            formDataPost.append('categoryName', categoryName);
            formDataPost.append('subCategoryName', subCategoryName || null);
            formDataPost.append('coverImage', coverImage);

            const response = await axios.post(url + '/add/product', formDataPost, { headers: { token } });
            const newPostId = response.data?.postId;

            if (!newPostId) {
                toast.error('Грешка: Невалидно ID на поста.');
                return;
            }

            setPostId(newPostId)
            toast.success('Постът беше добавен успешно!');

            if (imageUrl.length > 0) {
                const formDataImage = new FormData();
                imageUrl.forEach((image) => formDataImage.append('images', image))
                formDataImage.append('descriptions', JSON.stringify(descriptions));
                await axios.post(url + `/add/get/${newPostId}/images`, formDataImage, { headers: { token } });
            }

            setTitle('');
            setDescription('');
            setCoverImage(null);
            setImageUrl([]);
            setDescriptions([]);

        } catch (error) {
            console.error("Грешка при създаване на пост:", error);
            console.error("Детайли:", error.response?.data);
            const message = error.response?.data?.message || 'Грешка при връзка със сървъра';
            setServer(message);
            toast.error(message);
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSizeInMB = 5;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        const validFiles = files.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`Файлът "${file.name}" не е валиден. Разрешени формати: JPEG, PNG, WebP.`);
                return false;
            }
            if (file.size > maxSizeInBytes) {
                toast.error(`Файлът "${file.name}" е твърде голям. Максималният размер е ${maxSizeInMB} MB.`);
                return false;
            }
            return true;
        });

        setImageUrl(prev => [...prev, ...validFiles]);
        toast.success(`${validFiles.length} нови снимки добавени успешно.`);
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        category,
        subCategory,
        setSubCategory,
        setCategory,
        coverImage,
        setCoverImage,
        imageUrl,
        setImageUrl,
        descriptions,
        setDescriptions,
        loading,
        serverError,
        postId,
        setPostId,
        errors,
        handleImageUpload,
        handleSubmit
    }
}

export default useAddUse
