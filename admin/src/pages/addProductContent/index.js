import { Breadcrumbs, Chip, CircularProgress, emphasize, styled, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData, deleteData, editData } from '../../utils/api';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
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

const AddProductContent = () => {

    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productRamData, setProductRamData] = useState([]);
    const [formFields, setFormFields] = useState({ productRams: '' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        fetchDataFromApi("/api/productRams").then(res => setProductRamData(res));
    }, []);

    const showAlert = (msg, error = false) => {
        context.setAlertBox({ open: true, msg, error });
    }

    const addProductRams = (e) => {
        e.preventDefault();
        if (formFields.productRams === "") {
            showAlert('Please add product content', true);
            return;
        }
        setIsLoading(true);
        const action = !editId ? postData : editData;
        const url = !editId ? '/api/productRams/create' : `/api/productRams/${editId}`;

        action(url, formFields).then(res => {
            setIsLoading(false);
            showAlert(editId ? 'Product content updated successfully' : 'Product content added successfully');
            fetchDataFromApi("/api/productRams").then(res => setProductRamData(res));
            setEditId(null);
            setFormFields({ productRams: '' });
        }).catch(() => {
            setIsLoading(false);
            showAlert('Operation failed', true);
        });
    }

    const confirmDelete = (id) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    }

    const handleDelete = () => {
        deleteData(`/api/productRams/${deleteId}`).then(() => {
            showAlert('Product content deleted successfully');
            fetchDataFromApi("/api/productRams").then(res => setProductRamData(res));
        }).catch(() => showAlert('Delete failed', true));
        setDeleteDialogOpen(false);
        setDeleteId(null);
    }

    const updataData = (id) => {
        fetchDataFromApi(`/api/productRams/${id}`).then(res => {
            setEditId(id);
            setFormFields({ productRams: res.productRams });
        })
    }

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Add Product Content</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                    <StyleBreadcrumb component="a" href={'/'} label="Dashboard" icon={<FaHome fontSize="small" />} />
                    <StyleBreadcrumb label="Product Content" component="a" />
                </Breadcrumbs>
            </div>
            <form className='form'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className="col">
                                <div className="form-group">
                                    <h6>Product Content {editId ? '(Editing)' : ''}</h6>
                                    <input type="text" name="productRams" value={formFields.productRams} onChange={inputChange} placeholder="Enter product content" />
                                </div>
                            </div>
                            <Button type='submit' onClick={addProductRams} className='btn-blue btn-lg btn-big w-100'>
                                <FaCloudUploadAlt /> &nbsp; {isLoading ? <CircularProgress color='inherit' className='ms-3 loader' /> : editId ? 'UPDATE' : 'PUBLISH AND VIEW'}
                            </Button>
                            {editId && (
                                <Button type='button' onClick={() => { setEditId(null); setFormFields({ productRams: '' }) }} className='btn-blue btn-lg btn-big w-100 mt-3'>
                                    <FaPencilAlt /> &nbsp; CANCEL EDIT
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                {productRamData.length !== 0 &&
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div className='card p-4 mt-0'>
                                <div className="table-responsive mt-3">
                                    <table className="table table-bordered table-striped v-align">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>PRODUCT CONTENT</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productRamData.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.productRams}</td>
                                                    <td>
                                                        <div className="actions d-flex align-items-center">
                                                            <Button className="success" color="success" onClick={() => updataData(item.id)}><FaPencilAlt /></Button>
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
                }
            </form>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this product content?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddProductContent;