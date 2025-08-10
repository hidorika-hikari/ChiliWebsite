import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import React, { useContext, useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaImages } from "react-icons/fa";
import { fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const menuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP, // Shows ~6 items
            width: 250,
        },
    },
};

const StyleBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const AddProduct = () => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useNavigate();

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newImageUrls]);
        setFormFields(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
        event.target.value = null;
    };

    const handleAddImageUrl = () => {
        const url = newImageUrl.trim();
        if (url && !imagePreviews.includes(url)) {
            setImagePreviews(prev => [...prev, url]);
            setFormFields(prev => ({
                ...prev,
                images: [...prev.images, url]
            }));
            setNewImageUrl('');
        }
    };

    const handleRemoveImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setFormFields(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const [categoryVal, setCategoryVal] = useState('');
    const [subCategoryVal, setSubCategoryVal] = useState("");
    const [isFeaturedVal, setIsFeaturedVal] = useState(''); // Featured -> Organic/Non-Organic
    const [ratingValue, setRatingValue] = useState(null);

    const [productRams, setProductRams] = useState([]); // Content 1 ชิ้น สำหรับผลิตภัณฑ์ 10 ชิ้น สำหรับ เมล็ด
    const [productWeight, setProductWeight] = useState([]);
    const [productSize, setProductSize] = useState([]); // Size -> Spicy(Mild/Medium/Hot/Hell)

    const [productRamsData, setProductRamsData] = useState([]);
    const [productWeightData, setProductWeightData] = useState([]);
    const [productSizeData, setProductSizeData] = useState([]);

    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
        subCat: '',
        images: [],
        brand: '',
        price: null,
        oldPrice: null,
        category: '',
        countInStock: null,
        rating: 0,
        isFeatured: '',
        discount: '',
        productRams: [],
        productSize: [],
        productWeight: []
    })

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi("/api/productWeight").then((res) => {
            setProductWeightData(res);
        })
        fetchDataFromApi("/api/productRams").then((res) => {
            setProductRamsData(res);
        })
        fetchDataFromApi("/api/productSize").then((res) => {
            setProductSizeData(res);
        })
    }, []);

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            category: event.target.value
        }))
    };

    const handleChangeSubCategory = (event) => {
        setSubCategoryVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            subCat: event.target.value
        }))
    };

    const handleChangeIsFeatured = (event) => {
        setIsFeaturedVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            isFeatured: event.target.value
        }))
    };

    const handleChangeProductAttribute = (key) => (event) => {
        const {
            target: { value },
        } = event;
        const newValue = typeof value === 'string' ? value.split(',') : value;
        if (key === 'productRams') setProductRams(newValue);
        else if (key === 'productWeight') setProductWeight(newValue);
        else if (key === 'productSize') setProductSize(newValue);
        setFormFields(prev => ({
            ...prev,
            [key]: newValue
        }));
    };

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    const addProduct = (e) => {
        e.preventDefault();

        if (formFields.name === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please add product name',
                error: true
            });
            return false;
        }

        if (formFields.description === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please add product descriptions',
                error: true
            });
            return false;
        }

        if (!formFields.category) {
            context.setAlertBox({
                open: true,
                msg: 'Please select a category',
                error: true
            });
            return false;
        }

        if (!formFields.price) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product price',
                error: true
            });
            return false;
        }

        if (!formFields.oldPrice) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product old price',
                error: true
            });
            return false;
        }

        if (formFields.isFeatured === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please select if product is organic or not',
                error: true
            });
            return false;
        }

        if (!formFields.countInStock) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product stock',
                error: true
            });
            return false;
        }

        if (formFields.brand === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please add product brand',
                error: true
            });
            return false;
        }

        if (!formFields.rating || formFields.rating === 0) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product rating',
                error: true
            });
            return false;
        }

        if (formFields.images.length === 0) {
            context.setAlertBox({
                open: true,
                msg: 'Please add product images',
                error: true
            });
            return false;
        }

        setIsLoading(true);
        postData('api/products/create', formFields).then((res) => {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                msg: 'Product is created!',
                error: false
            });
            setFormFields({
                name: '',
                description: '',
                subCat: '',
                images: [],
                brand: '',
                price: 0,
                oldPrice: 0,
                category: '',
                countInStock: 0,
                rating: 0,
                isFeatured: false,
                discount: 0,
                productRams: '',
                productSize: '',
                productWeight: ''
            });
            history('/products');
        })
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Product Add</h5>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className="ms-auto breadcrumb_"
                    >
                        <StyleBreadcrumb
                            component="a"
                            href={'/'}
                            label="Dashboard"
                            icon={<FaHome fontSize="small" />}
                        />
                        <StyleBreadcrumb
                            label="Products"
                            component="a"
                        />
                        <StyleBreadcrumb label="Product Add" />
                    </Breadcrumbs>
                </div>

                <form className="form">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card p-4 mt-0">
                                <h5 className="mb-4">Basic Information</h5>
                                <div className="form-group">
                                    <h6>Product Name</h6>
                                    <input type="text" name="name" value={formFields.name} onChange={inputChange} />
                                </div>
                                <div className="form-group">
                                    <h6>Description</h6>
                                    <textarea rows="5" cols="10" name='description' value={formFields.description} onChange={inputChange} />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Category</h6>
                                            <Select
                                                className="w-100"
                                                value={categoryVal}
                                                displayEmpty
                                                MenuProps={menuProps}
                                                onChange={handleChangeCategory}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {
                                                    context.catData?.categoryList?.length !==
                                                    0 && context.catData?.categoryList?.map
                                                        ((cat, index) => {
                                                            return (
                                                                <MenuItem value={cat.id} key={index}>
                                                                    {cat.name}
                                                                </MenuItem>
                                                            )
                                                        })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Subcategory</h6>
                                            <Select
                                                className="w-100"
                                                value={subCategoryVal}
                                                displayEmpty
                                                onChange={handleChangeSubCategory}
                                                MenuProps={menuProps}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {
                                                    context.subCatData?.subCategoryList?.length !==
                                                    0 && context.subCatData?.subCategoryList?.map
                                                        ((subCat, index) => {
                                                            return (
                                                                <MenuItem className='text-capitalize'
                                                                    value={subCat.id} key={index}>{subCat.subCat}
                                                                </MenuItem>
                                                            )
                                                        })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Price</h6>
                                            <input
                                                type="text"
                                                name="price"
                                                value={formFields.price}
                                                onChange={inputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Old Price</h6>
                                            <input
                                                type="text"
                                                name="oldPrice"
                                                value={formFields.oldPrice}
                                                onChange={inputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Is Organic</h6>
                                            <Select
                                                className="w-100"
                                                value={isFeaturedVal}
                                                displayEmpty
                                                onChange={handleChangeIsFeatured}
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                <MenuItem value="true">
                                                    Organic
                                                </MenuItem>
                                                <MenuItem value="false">
                                                    Non-Organic
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Product Stock</h6>
                                            <input
                                                type="text"
                                                name="countInStock"
                                                value={formFields.countInStock}
                                                onChange={inputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Brand / Type</h6>
                                            <input
                                                type="text"
                                                name="brand"
                                                value={formFields.brand}
                                                onChange={inputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Schärfegrad</h6>
                                            <input
                                                type="text"
                                                name="discount"
                                                value={formFields.discount}
                                                onChange={inputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Product Content</h6>
                                            <Select
                                                multiple
                                                className="w-100"
                                                value={productRams}
                                                displayEmpty
                                                MenuProps={menuProps}
                                                onChange={handleChangeProductAttribute('productRams')}
                                                renderValue={(selected) => selected.map(id => {
                                                    const item = productRamsData.find(i => i._id === id);
                                                    return item ? item.productRams : id;
                                                }).join(', ')}
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                {
                                                    productRamsData?.map((item, index) => {
                                                        return (
                                                            <MenuItem value={item._id}>
                                                                {item.productRams}
                                                            </MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>Product Weight</h6>
                                            <Select
                                                multiple
                                                className="w-100"
                                                value={productWeight}
                                                displayEmpty
                                                MenuProps={menuProps}
                                                onChange={handleChangeProductAttribute('productWeight')}
                                                renderValue={(selected) => selected.map(id => {
                                                    const item = productWeightData.find(i => i._id === id);
                                                    return item ? item.productWeight : id;
                                                }).join(', ')}
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                {
                                                    productWeightData?.map((item, index) => {
                                                        return (
                                                            <MenuItem value={item._id}>
                                                                {item.productWeight}
                                                            </MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>Spicy Level</h6>
                                            <Select
                                                multiple
                                                className="w-100"
                                                value={productSize}
                                                displayEmpty
                                                MenuProps={menuProps}
                                                onChange={handleChangeProductAttribute('productSize')}
                                                renderValue={(selected) => selected.map(id => {
                                                    const item = productSizeData.find(i => i._id === id);
                                                    return item ? item.productSize : id;
                                                }).join(', ')}
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                {
                                                    productSizeData?.map((item, index) => {
                                                        return (
                                                            <MenuItem value={item._id}>
                                                                {item.productSize}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>Ratting</h6>
                                            <Rating
                                                name="simple-controlled"
                                                value={ratingValue}
                                                onChange={(event, newValue) => {
                                                    setRatingValue(newValue);
                                                    setFormFields(() => ({
                                                        ...formFields,
                                                        rating: newValue
                                                    }))
                                                }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4 mt-0">
                        <div className='imagesUploadSec'>
                            <h5 className="mb-4">Media & Published</h5>
                            <div className="form-group gap-2 align-items-center">
                                <h6>Image URL</h6>
                                <input
                                    placeholder='image url'
                                    type="text"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                />
                                <Button className="btn-blue btn-lg mt-3" onClick={handleAddImageUrl} variant="outlined" size="small">
                                    Add URL
                                </Button>
                            </div>
                            <div className='imgUploadBox d-flex align-items-center flex-wrap gap-3'>
                                {imagePreviews.map((src, index) => (
                                    <div className='uploadBox' key={index}>
                                        <span className='remove' onClick={() => handleRemoveImage(index)}>
                                            <IoCloseSharp />
                                        </span>
                                        <div className='box'>
                                            <LazyLoadImage
                                                alt={`image-${index}`}
                                                effect="blur"
                                                className="w-100"
                                                src={src}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className='uploadBox'>
                                    <input
                                        type=""
                                        name="images"
                                        onChange={handleImageChange}
                                    />
                                    <div className='info'>
                                        <FaImages />
                                        <h5>image upload</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <Button type='submit' onClick={addProduct} className='btn-blue btn-lg btn-big w-100'>
                            <FaCloudUploadAlt /> &nbsp; {isLoading === true ?
                                <CircularProgress color='inherit'
                                    className='ms-3 loader' /> : 'PUBLISH AND VIEW'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddProduct;