import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import React, { useContext, useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaImages } from "react-icons/fa";
import { editData, fetchDataFromApi } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
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

const ProductEdit = () => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(true);
    const history = useNavigate();
    const { id } = useParams();

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
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [isFeaturedVal, setIsFeaturedVal] = useState('');
    const [ratingValue, setRatingValue] = useState(null);

    const [productRams, setProductRams] = useState([]);
    const [productWeight, setProductWeight] = useState([]);
    const [productSize, setProductSize] = useState([]); // Size -> Spicy(Mild/Medium/Hot/Hell)

    const [productRamsData, setProductRamsData] = useState([]);
    const [productWeightData, setProductWeightData] = useState([]);
    const [productSizeData, setProductSizeData] = useState([]);

    const [catData, setCatData] = useState([]);
    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        name: '',
        subCat: null,
        description: '',
        images: [],
        brand: '',
        price: null,
        oldPrice: null,
        catName: '',
        category: '',
        countInStock: null,
        rating: 0,
        isFeatured: false,
        discount: 0,
        productRams: [],
        productSize: [],
        productWeight: []
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        setCatData(context.catData);
        if (id) {
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                context.setAlertBox({
                    open: true,
                    msg: 'Invalid Product ID format',
                    error: true
                });
                history('/products');
                return;
            }

            setProductLoading(true);
            fetchDataFromApi(`/api/products/${id}`).then((res) => {
                if (res) {
                    setFormFields({
                        name: res.name,
                        description: res.description,
                        images: res.images,
                        brand: res.brand,
                        price: res.price,
                        oldPrice: res.oldPrice,
                        catName: res.catName,
                        category: res.category,
                        subCat: res.subCat || null,
                        countInStock: res.countInStock,
                        rating: res.rating,
                        isFeatured: res.isFeatured,
                        discount: res.discount,
                        productRams: res.productRams,
                        productSize: res.productSize,
                        productWeight: res.productWeight
                    });

                    setCategoryVal(res.category);
                    setSubCategoryVal(res.subCat)
                    setIsFeaturedVal(res.isFeatured);
                    setRatingValue(res.rating);
                    setImagePreviews(res.images);
                    setProductRams(res.productRams);
                    setProductWeight(res.productWeight);
                    setProductSize(res.productSize);
                }
                setProductLoading(false);
            });
            fetchDataFromApi("/api/productWeight").then((res) => {
                setProductWeightData(res);
            })
            fetchDataFromApi("/api/productRams").then((res) => {
                setProductRamsData(res);
            })
            fetchDataFromApi("/api/productSize").then((res) => {
                setProductSizeData(res);
            })
        }
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20)
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            context.setProgress(100);
        })
    }, []);

    const handleChangeCategory = (event) => {
        const catId = event.target.value;
        setCategoryVal(catId);
        const selectedCat = context.catData?.categoryList?.find(cat => cat.id === catId);
        setFormFields(prev => ({
            ...prev,
            category: catId,
            catName: selectedCat ? selectedCat.name : ''
        }));
    };

    const handleChangeSubCategory = (event) => {
        setSubCategoryVal(event.target.value);
        setFormFields(prev => ({
            ...prev,
            subCat: event.target.value
        }));
    };

    const handleChangeIsFeatured = (event) => {
        setIsFeaturedVal(event.target.value);
        setFormFields(prev => ({
            ...prev,
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
        setFormFields(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const selectCat = (cat) => {
        setFormFields(prev => ({
            ...prev,
            catName: cat
        }));
    };

    const updateProduct = (e) => {
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

        if (!formFields.category) {
            context.setAlertBox({
                open: true,
                msg: 'Please Select a Category',
                error: true
            });
            return;
        }

        if (!formFields.price) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Price',
                error: true
            });
            return;
        }

        if (!formFields.oldPrice) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Old Price',
                error: true
            });
            return;
        }

        if (formFields.isFeatured === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please Select if Product is Organic or Not',
                error: true
            });
            return;
        }

        if (!formFields.countInStock) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Stock',
                error: true
            });
            return;
        }

        if (formFields.brand === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Brand',
                error: true
            });
        }

        if (!formFields.rating || formFields.rating === 0) {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Rating',
                error: true
            });
            return;
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
        editData(`/api/products/${id}`, formFields).then((res) => {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                msg: 'The Product has been Updated Successfully!',
                error: false
            });
            history('/products');
        })
            .catch((error) => {
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    msg: 'Error Updating Product',
                    error: true
                });
            });
    }

    if (productLoading) {
        return (
            <div className="right-content w-100 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Product Editing</h5>
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
                            href="/products"
                        />
                        <StyleBreadcrumb label="Product Editing" />
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
                                                    catData?.categoryList?.length > 0 && catData.categoryList.map((cat, index) => {
                                                        return (
                                                            <MenuItem value={cat.id} key={index} onClick={() => selectCat(cat.name)}>
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
                                            <h6>Scoville</h6>
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
                                                    setFormFields(prev => ({
                                                        ...prev,
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
                        <Button type='submit' onClick={updateProduct} className='btn-blue btn-lg btn-big w-100'>
                            <FaCloudUploadAlt /> &nbsp; {isLoading === true ?
                                <CircularProgress color='inherit'
                                    className='ms-3 loader' /> : 'UPDATE PRODUCT'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductEdit;