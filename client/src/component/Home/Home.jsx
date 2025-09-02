import React, { useContext, useEffect, useState } from 'react'
import Popular from '../Popular/Popular';
import './Home.css'
import { useParams } from 'react-router-dom';
import Details from '../Details/Details';
import MyContext from '../context/Context';
import Item from '../Item/Item';

const Home = () => {
    // const {id} = useParams()

    return (
        <div className='home-container'>
            <div>
                <Popular />
            </div>
        </div>
    )
}

export default Home
