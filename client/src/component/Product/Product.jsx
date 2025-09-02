import React, { useContext } from 'react'
import Details from '../Details/Details'
import { useParams } from 'react-router-dom'
import MyContext from '../context/Context';

const Product = () => {

    const { all_product } = useContext(MyContext)
    const { id } = useParams();
    return (
        <div>
        </div>
    )
}

export default Product
