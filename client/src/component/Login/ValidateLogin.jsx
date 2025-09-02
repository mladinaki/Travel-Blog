const validateForm = (values, formType = 'Sign Up') => {
    const errors = {};
    const emailRgx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (formType === 'Sign Up') {
        if (!values.username) errors.username = 'Името е задължително';
        if (!values.repeatPassword) errors.repeatPassword = 'Повтори паролата е задължително';
        if (values.password !== values.repeatPassword) {
            errors.repeatPassword = 'Паролите не съвпадат';
        }
        if (values.password && values.password.length < 6)
            errors.password = 'Паролата трябва да е поне 6 знака!';
    }
    
    // Validate Email
    if (!values.email) errors.email = 'Емайла е задължителен';
    else if (!emailRgx.test(values.email)) {
        errors.email = 'Невалиден формат на емайл';
    }

    // Validate Password
    if (!values.password) errors.password = 'Паролите не съвпадат';
    
    return errors;
};

export default validateForm;