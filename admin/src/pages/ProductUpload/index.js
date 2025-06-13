import { Breadcrumbs, Chip, emphasize, styled } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaImages } from "react-icons/fa";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

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
    const [categoryVal, setCategoryVal] = useState('');
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [isFeaturedVal, setIsFeaturedVal] = useState('');
    const [productRams, setProductRams] = useState([]);

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
    };

    const handleChangeSubCategory = (event) => {
        setSubCategoryVal(event.target.value);
    };

    const handleChangeIsFeatured = (event) => {
        setIsFeaturedVal(event.target.value);
    };

    const handleChangeProductRam = (event) => {
        const {
            target: { value },
        } = event;
        setProductRams(typeof value === 'string' ? value.split(',') : value);
    };

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
                            href="#"
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
                                    <input type="text" name="name"></input>
                                </div>
                                <div className="form-group">
                                    <h6>DESCRIPTION</h6>
                                    <textarea rows="5" cols="10"></textarea>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>CATEGORY</h6>
                                            <Select
                                                className="w-100"
                                                value={categoryVal}
                                                displayEmpty
                                                onChange={handleChangeCategory}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="men">
                                                    Men
                                                </MenuItem>
                                                <MenuItem value="woman">
                                                    Woman
                                                </MenuItem>
                                                <MenuItem value="kids">
                                                    Kids
                                                </MenuItem>
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
                                                onChange={
                                                    handleChangeSubCategory
                                                }
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value='Jeans'>
                                                    Jeans
                                                </MenuItem>
                                                <MenuItem value='Skirts'>
                                                    Skirts
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRICE</h6>
                                            <input
                                                type="text"
                                                name="price"
                                            ></input>
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
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6 className="text-uppercase">
                                                is Featured
                                            </h6>
                                            <Select
                                                className="w-100"
                                                value={isFeaturedVal}
                                                displayEmpty
                                                onChange={
                                                    handleChangeIsFeatured
                                                }
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
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
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT STOCK</h6>
                                            <input
                                                type="text"
                                                name="product stock"
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>BRAND</h6>
                                            <input
                                                type="text"
                                                name="brand"
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>DISCOUNT</h6>
                                            <input
                                                type="text"
                                                name="discount"
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT RAM</h6>
                                            <Select
                                                className="w-100"
                                                multiple
                                                value={productRams}
                                                displayEmpty
                                                onChange={
                                                    handleChangeProductRam
                                                }
                                                renderValue={(selected) =>
                                                    selected.length === 0 ? (
                                                        <em>None</em>
                                                    ) : (
                                                        selected.join(', ')
                                                    )
                                                }
                                            >
                                                <MenuItem value="4GB">
                                                    4GB
                                                </MenuItem>
                                                <MenuItem value="8GB">
                                                    8GB
                                                </MenuItem>
                                                <MenuItem value="16GB">
                                                    16GB
                                                </MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>RATINGS</h6>
                                            <Rating name="no-value" value={null} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4 mt-0">
                        <div className='imagesUploadSec'>
                            <h5 className="mb-4">Media And Published</h5>
                            <div className='imgUploadBox d-flex align-items-center'>
                                <div className='uploadBox'>
                                <span className='remove'><IoCloseSharp /></span>
                                    <div className='box'>
                                        <LazyLoadImage
                                            alt={"image"}
                                            effect="blur"
                                            className="w-100"
                                            src={'https://mironcoder-hotash.netlify.app/images/product/single/01.webp'}
                                            />
                                    </div>
                                </div>
                                <div className='uploadBox'>
                                    <input type="file" multiple="" name="images"></input>
                                    <div className='info'>
                                        <FaImages />
                                        <h5>image upload</h5>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <br/>
                        <Button className='btn-blue btn-lg btn-big w-100'>
                            <FaCloudUploadAlt/> &nbsp; PUBLISH AND VIEW
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductUpload;
