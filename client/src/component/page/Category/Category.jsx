import React, { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MyContext from '../../context/Context';
import './Category.css';

const Category = () => {
  const { categoryName } = useParams();
  const { url, getByCategories, postsByCategory } = useContext(MyContext);

  useEffect(() => {
    getByCategories(categoryName);
  }, [categoryName, getByCategories]);

  const posts = postsByCategory[categoryName] || [];

  return (
    <div className="container py-5 ">
      <h2 className="text-center mb-3 fs-5 mt-3 p-3">
        Публикации в категория: <span className="text-danger fw-bold">{categoryName}</span>
      </h2>

      <div className="row g-0">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="col-6 col-md-3 mb-3">
              <div className="card card_cont shadow-sm border-0 rounded-3 overflow-hidden">
                <img
                  src={url + '/uploads/' + post.coverImage}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text flex-grow-1">{post.description.slice(0, 100)}...</p>
                  <Link to={`/details/${post.id}`} className="btn btn-dark mt-2">
                    Прочети повече
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100">Няма публикации в тази категория.</p>
        )}
      </div>
    </div>
  );
};

export default Category;
