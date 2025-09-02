import { useCallback, useState } from "react"

const UseLogin = (validate, onSubmitHandler) => {
    const [errors, setErrors] = useState({})
    const [isSubmiting, setSubmiting] = useState(false)
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    })

    const onChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    
        if (errors[name]) {
            setErrors((prevErrors) => {
                const updateErrors = { ...prevErrors };
                delete updateErrors[name];
                return updateErrors
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmiting(true)
        

        // Validate form values
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0 && onSubmitHandler) {
            await onSubmitHandler(values);
        }
        setSubmiting(false);
    }

    const reset = () => {
        setValues({
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
        });
        setErrors({});
    };

    return {
        values,
        errors,
        reset,
        isSubmiting,
        onChange,
        handleSubmit
    }
}

export default UseLogin 