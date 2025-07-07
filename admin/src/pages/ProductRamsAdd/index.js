import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import { MyContext } from '../../App';
import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { fetchDataFromApi, postData, deleteData, editData } from '../../utils/api';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

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

const AddProductRams = () => {

    const [editId, setEditId] = useState(null); // Changed from false to null
    const [isLoading, setIsLoading] = useState(false);
    const [productRamData, setProductRamData] = useState([]);
    const [formFields, setFormFields] = useState({
        productRams: ''
    });

    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        fetchDataFromApi("/api/productRams").then((res) => {
            setProductRamData(res);
        })
    }, []);

    const addProductRams = (e) => {
        e.preventDefault();
        console.log(formFields)

        if (formFields.productRams === "") {
            context.setAlertBox({
                open: true,
                msg: 'Please Add Product Rams',
                error: true
            });
            return;
        }

        setIsLoading(true);
        if (!editId) {
            postData(`/api/productRams/create`, formFields).then(res => {
                setIsLoading(false);
                window.location.reload();
            })
        } else {
            editData(`/api/productRams/${editId}`, formFields).then((res) => {
                setIsLoading(false);
                window.location.reload();
            })
        }
    }

    const deleteItem = (id) => {
        deleteData(`/api/productRams/${id}`).then((res) => {
            window.location.reload();
        })
    }

    const updataData = (id) => {
        fetchDataFromApi(`/api/productRams/${id}`).then((res) => {
            setEditId(id);
            setFormFields({
                productRams: res.productRams
            });
        })
    }

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Add Product Rams</h5>
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
                        label="Product Rams"
                        component="a"
                        href={'/subCategory'}
                    />
                    <StyleBreadcrumb label="Add Product Rams" />
                </Breadcrumbs>
            </div>
            <form className='form'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className="col">
                                <div className="form-group">
                                    <h6>Product Ram {editId ? '(Editing)' : ''}</h6>
                                    <input
                                        type="text"
                                        name="productRams"
                                        value={formFields.productRams}
                                        onChange={inputChange}
                                    />
                                </div>
                            </div>
                            <Button
                                type='submit'
                                onClick={(e) => {
                                    window.location.reload();
                                    addProductRams(e);
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
                                        setFormFields({ productRams: '' });
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
                    productRamData.length !== 0 &&
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered table-striped v-align">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>PRODUCT RAM</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            productRamData?.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            {item.productRams}
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
                }
            </form>
        </div>
    )
}

export default AddProductRams;