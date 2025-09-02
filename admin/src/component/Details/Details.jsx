import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Details.css';

const Details = ({ url,token}) => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const response = await axios.get(`${url}/add/get/${id}`,{headers: { token }});
                const { postDetails, imageDetails } = response.data;

                setPost(postDetails);
                setImages(Array.isArray(imageDetails) ? imageDetails : []);
            } catch (error) {
                console.error("Error fetching post details:", error.message);
            }
        };

        getDetails();
    }, [id, url]);

    return (
        <div className="main-container">
            <div className="content-container">
                <div className="details-container">
                    {post && (
                        <>
                            <h2 className="details-title">{post.title}</h2>

                            {post?.coverImage && (
                                <img
                                    src={`${url}/uploads/${post.coverImage}`}
                                    className="details-cover"
                                    alt={post.title}
                                />
                            )}

                            <hr className="details-divider" />

                            <div className="details-gallery">
                                {images.map((el, index) => (
                                    <div className="details-item" key={index}>
                                        <img
                                            src={`${url}/uploads/${el.image_url}`}
                                            className="details-image"
                                            alt={el.descriptions || `Image ${index + 1}`}
                                        />
                                        <p className="details-description">{el.descriptions}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Details;
