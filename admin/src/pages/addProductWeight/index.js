import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData, deleteData, editData } from '../../utils/api';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import React, { useContext, useEffect, useState } from 'react';

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

const AddProductWeight = () => {
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productWeightData, setProductWeightData] = useState([]);
    const [formFields, setFormFields] = useState({ productWeight: '' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetchDataFromApi("/api/productWeight").then(res => setProductWeightData(res));
    }

    const addProductWeight = async (e) => {
        e.preventDefault();
        if (!formFields.productWeight) {
            context.setAlertBox({ open: true, msg: 'Please add product weight', error: true });
            return;
        }

        setIsLoading(true);
        try {
            if (!editId) {
                await postData('/api/productWeight/create', formFields);
                context.setAlertBox({ open: true, msg: 'Product weight added successfully!', error: false });
            } else {
                await editData(`/api/productWeight/${editId}`, formFields);
                context.setAlertBox({ open: true, msg: 'Product weight updated successfully!', error: false });
                setEditId(null);
            }
            setFormFields({ productWeight: '' });
            fetchData();
        } catch {
            context.setAlertBox({ open: true, msg: 'Something went wrong!', error: true });
        } finally {
            setIsLoading(false);
        }
    }

    const confirmDelete = (id) => setDeleteDialog({ open: true, id });

    const handleDelete = async () => {
        try {
            await deleteData(`/api/productWeight/${deleteDialog.id}`);
            context.setAlertBox({ open: true, msg: 'Product weight deleted successfully!', error: false });
            fetchData();
        } catch {
            context.setAlertBox({ open: true, msg: 'Failed to delete product weight', error: true });
        } finally {
            setDeleteDialog({ open: false, id: null });
        }
    }

    const editItem = (id) => {
        fetchDataFromApi(`/api/productWeight/${id}`).then(res => {
            setEditId(id);
            setFormFields({ productWeight: res.productWeight });
        });
    }

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Add Product Weight</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                    <StyleBreadcrumb component="a" href="/" label="Dashboard" icon={<FaHome fontSize="small" />} />
                    <StyleBreadcrumb label="Product Weight" component="a" />
                </Breadcrumbs>
            </div>

            <form className='form' onSubmit={addProductWeight}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='col'>
                                <div className="form-group">
                                    <h6>Product Weight {editId ? '(Editing)' : ''}</h6>
                                    <input
                                        type="text"
                                        name="productWeight"
                                        value={formFields.productWeight}
                                        onChange={inputChange}
                                        placeholder="Enter product weight"
                                    />
                                </div>
                            </div>

                            <Button
                                type='submit'
                                className='btn-blue btn-lg btn-big w-100 mt-3'
                                disabled={isLoading}
                            >
                                <FaCloudUploadAlt /> &nbsp;
                                {isLoading ? <CircularProgress color='inherit' size={20} className='ms-3' /> : editId ? 'UPDATE' : 'PUBLISH AND VIEW'}
                            </Button>

                            {editId && (
                                <Button
                                    type='button'
                                    onClick={() => { setEditId(null); setFormFields({ productWeight: '' }); }}
                                    className='btn-blue btn-lg btn-big w-100 mt-3'
                                >
                                    <FaPencilAlt /> &nbsp; CANCEL EDIT
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {productWeightData.length > 0 && (
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped v-align">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>PRODUCT WEIGHT</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productWeightData.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.productWeight}</td>
                                                    <td>
                                                        <div className="actions d-flex align-items-center">
                                                            <Button className="success" color="success" onClick={() => editItem(item.id)}><FaPencilAlt /></Button>
                                                            <Button className="error" color="error" onClick={() => confirmDelete(item.id)}><MdDelete /></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete this product weight?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddProductWeight;