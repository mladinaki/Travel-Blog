import { useContext } from 'react';
import MyContext from '../context/Context';
import { Button, Carousel } from 'react-bootstrap';
import Mostread from '../Mostread/Mostread';
import { Link, useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './Popular.css';
import { useEffect } from 'react';

const Popular = () => {
    const { id } = useParams();
    const { all_product, url, views, getRecentPosts } = useContext(MyContext);

    const images = [
        assets.woman_5,
        assets.india,
        assets.woman_6,
    ];

    return (
        <div className="container-fluid content-all">
            <div className="carousel-container">
                <Carousel interval={3000} fade>
                    {images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100 slider-image"
                                src={image}
                                alt={`Slide ${index + 1}`}
                                style={{ height: "350px", objectFit: "cover" }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            <div className="row">
                <div className="col md-9">
                    <div className="d-flex flex-wrap gap-0">
                        {Array.from(all_product).map((product, index) => (
                            <div key={index} className="card p-2 shadow-sm" style={{ width: "17rem", overflow: "hidden" }}>
                                <Link to={`/details/${product.id}`}>
                                    <img
                                        src={url + '/uploads/' + product.coverImage}
                                        className="card-img-top mt-2"
                                        style={{ height: '8rem', objectFit: 'cover' }}
                                        alt=""
                                    />
                                </Link>
                                <div className='title-popular'>
                                    <h5 className="text-truncate fw-bolder mb-2 mt-3" style={{ fontSize: '17px', paddingLeft: "10px" }}>
                                        {product.title}
                                    </h5>
                                </div>
                                <div className="text-start ps-2">
                                    <i className="bi bi-calendar2-plus me-1" style={{ color: "#0ABAB5" }}></i>
                                    <span style={{   color: "#027E88", fontSize: "11px", marginRight: "10px" }}>
                                        {new Date(product.createdAt).toLocaleDateString('bg-BG', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        }).replace(/\//g, '.')}
                                    </span>
                                    <i className="bi bi-eye"></i>
                                    <span className='m-1' style={{ fontSize: "13px",   color: "#027E88 "}}>
                                        {views[product.id] ?? product.views} гледания
                                    </span>
                                </div>
                                <div className="card-body border-0 p-0">
                                    <p className="card-text small mt-4 text-start fs-6">
                                        {product.description.slice(0, 150)}...[...]
                                    </p>
                                </div>
                                <div className=" p-2 bnt-see-more">
                                    <Link to={`/details/${product.id}`}>

                                        <button className="btn fas fa-long-arrow-alt-right">
                                            Прочети повече<i class="bi bi-arrow-right"></i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-3 d-flex justify-content-center">
                    <Mostread id={id} />
                </div>
            </div>
        </div>
    );
}

export default Popular;
