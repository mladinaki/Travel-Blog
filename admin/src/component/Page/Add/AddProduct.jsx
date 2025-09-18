import './Addproduct.css'
import { Button, Form } from 'react-bootstrap'

import useAddUse from '../../Hook/addUse';
import Category from '../../Category/Category';

const AddProduct = ({ url, token }) => {

    const {
        errors,
        title,
        setTitle,
        description,
        setDescription,
        setCategory,
        coverImage,
        setCoverImage,
        imageUrl,
        setSubCategory,
        setImageUrl,
        setDescriptions,
        loading,
        serverError,
        handleImageUpload,
        handleSubmit
    } = useAddUse(url, token);

    return (
        <div>
            <div className="form_hoa">
                <div className="box_login col-auto">
                    <h4 className='text-center font-heading'>Добавяне на пътепис</h4>
                    <Form onSubmit={handleSubmit}>

                        <Form.Label className='form-group-custom'>Име на статията</Form.Label>
                        <Form.Control className='textarea-placeholder-text'
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            type="text"
                            placeholder="Име на статията..." >
                            {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
                        </Form.Control>

                        <Form.Label className='form-group-custom'>Описание</Form.Label>
                        <textarea className='textarea-placeholder-text w-100'
                            style={{ height: "6rem" }}
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            type="text"
                            placeholder="Описание на статията..." />
                        {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}

                        <label htmlFor="coverImage" className='form-group-custom'>Избери изображение
                            <div className="mb-1">
                                <Form.Control className='textarea-placeholder-text'
                                    type="file"
                                    hidden
                                    id="coverImage"
                                    name="coverImage"
                                    onChange={(e) => setCoverImage(e.target.files[0])} />
                                {errors.coverImage && <p style={{ color: "red" }}>{errors.coverImage}</p>}
                            </div>
                            {coverImage ? (
                                <img className=''
                                    style={{ width: "100px", height: "75px", border: "1px solid #a2a2a2" }}
                                    src={URL.createObjectURL(coverImage)}
                                    alt="Peview"
                                />

                            ) : (
                                <i className="bi bi-cloud-upload" style={{ color: "#2d2d2d", fontSize: "1rem" }}></i>
                            )}
                        </label>

                        <Form.Group>
                            <label className='form-group-custom'>Категории</label>
                            <Category onCategoryChange={(value) => setCategory(value)}
                                onSubCategoryChange={(value) => setSubCategory(value)}
                            />
                        </Form.Group>

                        <Form.Group>

                            <label htmlFor="images" className='form-group-custom'>Избери изображение
                                <Form.Control className="form-control"
                                    onChange={handleImageUpload}
                                    multiple
                                    accept="image/*"
                                    type="file"
                                    id="images"
                                    name="images"
                                    hidden
                                    placeholder="Описание...">
                                </Form.Control>

                                <div className="col-body upload-img">
                                    {imageUrl && imageUrl.length > 0 ? (
                                        imageUrl.map((image, index) => (
                                            <div key={`${image.name}=${index}`} style={{ position: "relative", display: "inline-block", marginRight: "3px" }}>
                                                <img
                                                    style={{ width: "100px" }}
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`} />
                                                <button style={{
                                                    position: "absolute",
                                                    top: -5,
                                                    right: 0,
                                                    background: "red",
                                                    color: "white",
                                                    backgroundColor:"black",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    cursor: "pointer"
                                                }} type='button' onClick={() => {
                                                    setImageUrl(prev => prev.filter((_, i) => i !== index))
                                                }}><p style={{ position: "relative", bottom: 10, right: 3 }}>&times;</p></button>
                                            </div>
                                        ))
                                    ) : (
                                        <i className="bi bi-cloud-upload" style={{ color: "#2d2d2d", fontSize: "3rem" }}></i>
                                    )}
                                    <small className="form-text" style={{ display: 'flex', marginTop: 20 }} >
                                        Можете да изберете няколко изображения едновременно.
                                    </small>
                                </div>
                            </label>

                            {imageUrl.map((_, index) => (
                                <Form.Group key={index} className="form-group-custom">
                                    <textarea className="w-100" style={{ height: "7rem" }}

                                        onChange={(e) =>
                                            setDescriptions((prev) => {
                                                const updated = [...prev];
                                                updated[index] = e.target.value;
                                                return updated;
                                            })
                                        }
                                        placeholder={`Description for image ${index + 1}${_.name}`}
                                    />
                                </Form.Group>
                            ))}
                        </Form.Group>

                        <div className="row-item md-3">
                            <Button type="submit"
                                className='w-25 p-2 btn-custom'>
                                {loading ? 'Моля изчакайте...' : 'Качи пост'}
                            </Button>
                        </div>
                        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct
