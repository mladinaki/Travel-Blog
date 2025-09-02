import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../../context/Context';
import { Link } from 'react-router-dom';

const Category = () => {
  const { categoryName } = useParams();
  const { url, getByCategories, postsByCategory } = useContext(MyContext)

  useEffect(() => {
    getByCategories(categoryName);
  }, [categoryName, getByCategories]);

  const posts = postsByCategory[categoryName] || []

  return (
    <div className="container mt-5">
      <h2 className="text-center fs-5 mb-2 p-4" style={{ marginTop: "5rem" }}>Публикации в категория: <span style={{
        color: "red",
        fontWeight: "bolder",
        fontSize: "17px",
        letterSpacing: 2
      }}>{categoryName}</span></h2>

      <div className="row justify-content-center">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <img
                  src={url + '/uploads/' + post.coverImage}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text text">{post.description.slice(0, 100)}[...]</p>
                  <Link to={`/details/${post.id}`} className="btn btn-dark mt-auto">Прочети повече</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Няма публикации в тази категория.</p>
        )}
      </div>
    </div>

  );
};

export default Category;
