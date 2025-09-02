import React, { useContext } from 'react';
import { Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Item.css';
import MyContext from '../context/Context';

const Item = ({ id, image, name }) => {
    const { url } = useContext(MyContext);

    return (
        <div className='item'>
            <Link to={`/details/${id}`} className="text-decoration-none">
                <div className='row ms-4'>
                    <div className='col'>
                        <div className="card-body">
                            <div className='row' style={{ width: "18rem" }}>
                                <Image
                                    className='image-top'
                                    style={{ height: '9rem', objectFit: "cover" }}
                                    src={`${url}/images/${image}`}
                                    alt='image'
                                />
                                <h5 className='card-title fs-6 text-truncate'>{name}</h5>

                                <Button
                                    className='btn btn-primary w-50 flex-column rounded-pill border-0 shadow-none'
                                    style={{ fontSize: "13px" }}
                                    variant="dark"
                                >
                                    Прегледай Още
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Item;
