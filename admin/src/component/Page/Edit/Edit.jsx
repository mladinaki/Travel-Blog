import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Category from '../../Category/Category';

const Edit = ({ url, token }) => {
  const { id } = useParams();

  const [serverError, setServer] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${url}/add/get/${id}`, { headers: { token } });
        const post = response.data?.postDetails;
        if (post) {
          setTitle(post.title || '');
          setDescription(post.description || '');
          setCategory(post.categoryId || '');
          setSubCategory(post.subCategoryId || '');
          setCoverImageUrl(post.coverImage || '');
          setOldImages(post.images || []);
          setDescriptions(post.descriptions || []);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id, url, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/add/categoriesEdit`, { headers: { token } });
        setCategories(response.data.category); // category -> съдържа масив с subCategories
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, [url, token]);

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
    setCoverImageUrl('');
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveOldImage = (index) => setOldImages(prev => prev.filter((_, i) => i !== index));
  const handleRemoveNewImage = (index) => setNewImages(prev => prev.filter((_, i) => i !== index));

  const editHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServer('');

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("categoryId", category || '');
      formData.append("subCategoryId", subCategory || '');

      if (coverImage) formData.append("coverImage", coverImage);
      newImages.forEach((image, index) => formData.append(`newImage_${index}`, image));
      descriptions.forEach((desc, index) => formData.append(`description_${index}`, desc));

      await axios.put(`${url}/add/edit/post/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token
        }
      });

      alert("Постът е успешно обновен!");
    } catch (error) {
      console.error("Error updating post:", error);
      setServer("Грешка при обновяване на поста!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form_hoa">
        <div className="box_login col-auto">
          <h4 className='text-center font-heading'>Редакция на пътепис</h4>
          <Form onSubmit={editHandler}>
            <Form.Label>Име на статията</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Име на статията..."
            />

            <Form.Label>Описание</Form.Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-100'
              style={{ height: "6rem" }}
              placeholder="Описание на статията..."
            />

            <label htmlFor="coverImage">Корица</label>
            <Form.Control type="file" id="coverImage" onChange={handleCoverImageChange} hidden />
            <div>
              {coverImage ? (
                <img src={URL.createObjectURL(coverImage)} alt="Preview" width="100" />
              ) : coverImageUrl ? (
                <img src={coverImageUrl} alt="Current Cover" width="100" />
              ) : (
                <i className="bi bi-cloud-upload" style={{ fontSize: "3rem" }}></i>
              )}
            </div>

            <Category
              categories={categories}
              category={categories.find(cat => cat.id === category) || null}
              subCategory={categories
                .find(cat => cat.id === category)
                ?.subCategories?.find(sub => sub.id === subCategory) || null}
              onCategoryChange={(cat) => {
                setCategory(cat?.id || '');
                setSubCategory('');
              }}
              onSubCategoryChange={(sub) => {
                setSubCategory(sub?.id || '');
              }}
            />

            <label htmlFor="images">Допълнителни изображения</label>
            <Form.Control type="file" id="images" multiple onChange={handleMultipleFiles} hidden />

            <div className="upload-img">
              {oldImages.map((image, index) => (
                <div key={index} style={{ display: "inline-block", position: "relative" }}>
                  <img src={image} alt={`Old ${index}`} width="100" />
                  <button onClick={() => handleRemoveOldImage(index)} style={{ position: "absolute", top: 0, right: 0 }}>✖</button>
                </div>
              ))}

              {newImages.map((file, index) => (
                <div key={index} style={{ display: "inline-block", position: "relative" }}>
                  <img src={URL.createObjectURL(file)} alt={`New ${index}`} width="100" />
                  <button onClick={() => handleRemoveNewImage(index)} style={{ position: "absolute", top: 0, right: 0 }}>✖</button>
                </div>
              ))}
            </div>

            <Button type="submit">{loading ? 'Моля изчакайте...' : 'Обнови поста'}</Button>
            {serverError && <p style={{ color: "red" }}>{serverError}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
