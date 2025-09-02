import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MyContext from '../context/Context';

const Mostread = () => {
  const { id } = useParams();
  const { url, token, views, recentPosts, mostReadView, getRecentPosts } = useContext(MyContext);

  useEffect(() => {
    if (id) {
      mostReadView(id).then(() => {
        getRecentPosts();
      });
    } else {
      getRecentPosts();
    }
  }, [id]);

  if (!token) {
    return <div className='p-3 text-muted'>Само за регистрирани потребители</div>;
  }

  return (
    <div className='border rounded mt-3 mx-1' style={{ background: "white", width: "21rem" }}>
      <h4 className='ms-3 mb-4 mt-4 border-bottom pb-2' style={{ borderBottom: "1px solid 007bff", paddingBottom: "8px" }}>Най-четени</h4>
      <div className=' d-flex flex-wrap'>{recentPosts.length === 0
        ? <div className='p-3 text-muted'>Няма налични разгледани постове!</div>
        : recentPosts.map((p, i) => (
          <div key={p.id || i} className='d-flex  gap-3 mb-3 border-bottom pb-2'>
            <hr />
            <img src={`${url}/uploads/${p.Post.coverImage}`} alt={p.Post.title}
              style={{
                borderRadius: "5px",
                width: "120px",
                height: "90px",
                borderRadius: "5px",
                objectFit: "cover"
              }} />
            <div style={{ fontSize: '14px', marginLeft: "2px", color: "#3a3a3a", fontWeight: 600, width: "10rem" }}> {p.Post.title}</div>
          </div>
        ))}</div>
    </div>
  )
}

export default Mostread
