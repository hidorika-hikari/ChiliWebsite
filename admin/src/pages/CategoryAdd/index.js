import { Breadcrumbs, Chip, emphasize, styled } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { postData } from '../../ultils/api';

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


    const [formFields, setFromFields] = useState({
        name: '',
        images: [],
        color: ''
    });

    const changeInput = (e) => {
        setFromFields(()=>(
            {
                ...formFields,
                [e.target.name]:e.target.value
            }
        ))
    }

    const addImgUrl = (e) => {
        const arr = [];
        arr.push(e.target.value);
        setFromFields(()=>(
            {
                ...formFields,
                [e.target.name]:arr
            }
        ))
    }

    const addCategory = (e) => {
        e.preventDefault();
        postData('api/category/create',formFields);
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Add Category</h5>
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
                            label="Category"
                            component="a"
                            href="#"
                        />
                        <StyleBreadcrumb label="Add Category" />
                    </Breadcrumbs>
                </div>

                <form className="form">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card p-4 mt-0">
                                
                                <div className="form-group">
                                    <h6>CATEGORY</h6>
                                    <input type="text" name='name' onChange={changeInput}/>
                                </div>
                                <div className="form-group">
                                    <h6>IMAGE URL</h6>
                                    <input type="text" name='images' onChange={addImgUrl}/>
                                </div>
                                <div className="form-group">
                                    <h6>COLOR</h6>
                                    <input type="text" name='color' onChange={changeInput}/>
                                </div>

                                <br/>
                                <Button type="submit" onClick={addCategory} className='btn-blue btn-lg btn-big w-100'>
                                    <FaCloudUploadAlt/> &nbsp; PUBLISH AND VIEW
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductUpload;
