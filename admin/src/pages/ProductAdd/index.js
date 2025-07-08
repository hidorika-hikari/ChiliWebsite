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
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

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

const ProductUpload = () => {
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

    const [productRams, setProductRams] = useState([]); // Maturation period
    const [productWeight, setProductWeight] = useState([]);
    const [productSize, setProductSize] = useState([]); // Size -> Spicy(Mild/Medium/Hot/Hell)

    const [productRamsData, setProductRamsData] = useState([]);
    const [productWeightData, setProductWeightData] = useState([]);
    const [productSizeData, setProductSizeData] = useState([]);

    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
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
        discount: 0,
        productRams: [],
        productSize: [],
        productWeight: []
    })

    useEffect(() => {
        window.scrollTo(0, 0);
        setCatData(context.catData);
        setSubCatData(context.subCatData);

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
                msg: 'Please Add Product Name',
                error: true
            });
        }

        if (formFields.description === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Description',
                error: true
            });
        }

        if (formFields.category === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please Select a Category',
                error: true
            });
        }

        if (formFields.price === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Price',
                error: true
            });
        }

        if (formFields.oldPrice === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product oldPrice',
                error: true
            });
        }

        if (formFields.isFeatured === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please Select the Product Featured',
                error: true
            });
        }

        if (formFields.countInStock === null) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Stock',
                error: true
            });
        }

        if (formFields.brand === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Brand',
                error: true
            });
        }

        if (formFields.rating === 0) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Rating',
                error: true
            });
        }

        if (formFields.images.length === 0) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Images',
                error: true
            });
        }

        console.log(formFields)
        setIsLoading(true);
        postData('api/products/create', formFields).then((res) => {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                msg: 'The Product is Created!',
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
                    <h5 className="mb-0">Product Upload</h5>
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
                            href="#"
                        />
                        <StyleBreadcrumb label="Product Upload" />
                    </Breadcrumbs>
                </div>

                <form className="form">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card p-4 mt-0">
                                <h5 className="mb-4">Basic Information</h5>
                                <div className="form-group">
                                    <h6>PRODUCT NAME</h6>
                                    <input type="text" name="name" value={formFields.name} onChange={inputChange} />
                                </div>
                                <div className="form-group">
                                    <h6>DESCRIPTION</h6>
                                    <textarea rows="5" cols="10" name='description' value={formFields.description} onChange={inputChange} />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>CATEGORY</h6>
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
                                                                <MenuItem className='text-capitalize'
                                                                    value={cat.id} key={index}>{cat.name}
                                                                </MenuItem>
                                                            )
                                                        })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>SUB CATEGORY</h6>
                                            <Select
                                                className="w-100"
                                                value={subCategoryVal}
                                                displayEmpty
                                                onChange={handleChangeSubCategory}
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
                                            <h6>PRICE</h6>
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
                                            <h6>OLD PRICE</h6>
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
                                            <h6>IS ORGANIC</h6>
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
                                                    True
                                                </MenuItem>
                                                <MenuItem value="false">
                                                    False
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT STOCK</h6>
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
                                            <h6>BRAND / TYPE</h6>
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
                                            <h6>SCOVILLE</h6>
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
                                            <h6>PRODUCT RAM</h6>
                                            <Select
                                                multiple
                                                className="w-100"
                                                value={productRams}
                                                displayEmpty
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
                                            <h6>PRODUCT WEIGHT</h6>
                                            <Select
                                                multiple
                                                className="w-100"
                                                value={productWeight}
                                                displayEmpty
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
                                            <h6>SPICY LEVEL</h6>
                                            <Select
                                                multiple
                                                className="w-100"
                                                value={productSize}
                                                displayEmpty
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
                                            <h6>RATINGS</h6>
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
                            <h5 className="mb-4">Media And Published</h5>
                            <div className="form-group gap-2 align-items-center">
                                <h6>IMAGE URL</h6>
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

export default ProductUpload;