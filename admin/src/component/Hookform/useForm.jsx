import React from 'react'
import { useState } from 'react'

const useForm = (initialValue, submitHandler) => {
    const [values, setValues] = useState(initialValue)

    const onChange = (e) => {
        const {  name,value } = e.target;
        setValues({ ...values, [name]: value })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (submitHandler) {
            submitHandler(initialValue)
        }
    }

    return {
        onChange,
        values,
        onSubmit
    }
}

export default useForm
