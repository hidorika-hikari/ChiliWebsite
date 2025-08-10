import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import { fetchDataFromApi, postData, deleteData, editData } from '../../utils/api';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { MyContext } from '../../App';
import React, { useContext, useEffect, useState } from 'react';
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

const AddProductSpicy = () => {

    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productSizeData, setProductSizeData] = useState([]);
    const [formFields, setFormFields] = useState({
        productSize: ''
    });

    const context = useContext(MyContext);
    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        fetchDataFromApi("/api/productSize").then((res) => {
            setProductSizeData(res);
        })
    }, []);

    const addProductSize = (e) => {
        e.preventDefault();

        if (formFields.productSize === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please add product spicy level',
                error: true
            });
            return false;
        }

        setIsLoading(true);
        if (!editId) {
            postData(`/api/productSize/create`, formFields).then(res => {
                setIsLoading(false);
                window.location.reload();
            })
        } else {
            editData(`/api/productSize/${editId}`, formFields).then((res) => {
                setIsLoading(false);
                window.location.reload();
            })
        }
    }

    const deleteItem = (id) => {
        deleteData(`/api/productSize/${id}`).then((res) => {
            window.location.reload();
        })
    }

    const updataData = (id) => {
        fetchDataFromApi(`/api/productSize/${id}`).then((res) => {
            setEditId(id);
            setFormFields({
                productSize: res.productSize
            });
        })
    }

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Add Product Spicy Level</h5>
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
                        label="Product Spicy Level"
                        component="a"
                    />
                </Breadcrumbs>
            </div>
            <form className='form'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className="col">
                                <div className="form-group">
                                    <h6>Product Spicy Level {editId ? '(Editing)' : ''}</h6>
                                    <input
                                        type="text"
                                        name="productSize"
                                        value={formFields.productSize}
                                        onChange={inputChange}
                                    />
                                </div>
                            </div>
                            <Button
                                type='submit'
                                onClick={(e) => {
                                    window.location.reload();
                                    addProductSize(e);
                                }}
                                className='btn-blue btn-lg btn-big w-100'
                            >
                                <FaCloudUploadAlt /> &nbsp; {isLoading === true ?
                                    <CircularProgress color='inherit'
                                        className='ms-3 loader' /> : editId ? 'UPDATE' : 'PUBLISH AND VIEW'}
                            </Button>
                            {editId && (
                                <Button
                                    type='button'
                                    onClick={() => {
                                        setEditId(null);
                                        setFormFields({ productSize: '' });
                                    }}
                                    className='btn-blue btn-lg btn-big w-100 mt-3'
                                >
                                    <FaPencilAlt /> &nbsp; CANCEL EDIT
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                {
                    productSizeData.length !== 0 &&
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                <div className="table-responsive mt-3">
                                    <table className="table table-bordered table-striped v-align">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>SPICY LEVEL</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productSizeData?.map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                {item.productSize}
                                                            </td>
                                                            <td>
                                                                <div className="actions d-flex align-items-center">
                                                                    <Button
                                                                        className="success"
                                                                        color="success"
                                                                        onClick={() => updataData(item.id)}
                                                                    >
                                                                        <FaPencilAlt />
                                                                    </Button>
                                                                    <Button
                                                                        className="error"
                                                                        color="error"
                                                                        onClick={() => deleteItem(item.id)}
                                                                    ><MdDelete />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </form>
        </div>
    )
}

export default AddProductSpicy;