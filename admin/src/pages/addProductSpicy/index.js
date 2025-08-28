import { Breadcrumbs, Chip, CircularProgress, emphasize, styled, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { FaHome, FaCloudUploadAlt, FaPencilAlt } from "react-icons/fa";
import { fetchDataFromApi, postData, deleteData, editData } from '../../utils/api';
import { MdDelete } from 'react-icons/md';
import { MyContext } from '../../App';
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

const AddProductSpicy = () => {
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productSizeData, setProductSizeData] = useState([]);
    const [formFields, setFormFields] = useState({ productSize: "" });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const context = useContext(MyContext);

    const inputChange = (e) => {
        setFormFields({ ...formFields, [e.target.name]: e.target.value });
    };

    const fetchData = async () => {
        try {
            const res = await fetchDataFromApi("/api/productSize");
            setProductSizeData(res || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setProductSizeData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showAlert = (msg, error = false) => {
        context.setAlertBox({ open: true, msg, error });
    };

    const addOrUpdateProductSize = async () => {
        if (formFields.productSize.trim() === "") {
            showAlert("Please add product spicy", true);
            return;
        }

        setIsLoading(true);
        try {
            if (!editId) {
                await postData("/api/productSize/create", formFields);
                showAlert("Product spicy added successfully");
            } else {
                await editData(`/api/productSize/${editId}`, formFields);
                showAlert("Product spicy updated successfully");
            }

            setFormFields({ productSize: "" });
            setEditId(null);
            fetchData();
        } catch (err) {
            console.error("API Error:", err);
            showAlert("Operation failed", true);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteData(`/api/productSize/${deleteId}`);
            showAlert("Product spicy deleted successfully");
            fetchData();
        } catch (err) {
            console.error("Delete Error:", err);
            showAlert("Delete failed", true);
        } finally {
            setDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    const loadDataForEdit = (id) => {
        const item = productSizeData.find((p) => String(p.id) === String(id));
        if (item) {
            setEditId(id);
            setFormFields({ productSize: item.productSize });
        }
    };

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Add Product Spicy</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                    <StyleBreadcrumb component="a" href={"/"} label="Dashboard" icon={<FaHome fontSize="small" />} />
                    <StyleBreadcrumb label="Product Spicy" component="a" />
                </Breadcrumbs>
            </div>

            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    addOrUpdateProductSize();
                }}
            >
                <div className="row">
                    <div className="col-sm-9">
                        <div className="card p-4 mt-0">
                            <div className="col">
                                <div className="form-group">
                                    <h6>Product Spicy {editId ? "(Editing)" : ""}</h6>
                                    <input
                                        type="text"
                                        name="productSize"
                                        value={formFields.productSize}
                                        onChange={inputChange}
                                        placeholder="Enter product spicy level"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="btn-blue btn-lg btn-big w-100"
                                disabled={isLoading}
                            >
                                <FaCloudUploadAlt /> &nbsp;
                                {isLoading ? <CircularProgress color="inherit" className="ms-3 loader" /> : editId ? "UPDATE" : "PUBLISH AND VIEW"}
                            </Button>

                            {editId && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setEditId(null);
                                        setFormFields({ productSize: "" });
                                    }}
                                    className="btn-blue btn-lg btn-big w-100 mt-3"
                                >
                                    <FaPencilAlt /> &nbsp; CANCEL EDIT
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {productSizeData.length > 0 && (
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="card p-4 mt-0">
                                <div className="table-responsive mt-3">
                                    <table className="table table-bordered table-striped v-align">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>PRODUCT SPICY</th>
                                                <th>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productSizeData.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{item.productSize}</td>
                                                    <td>
                                                        <div className="actions d-flex align-items-center">
                                                            <Button
                                                                className='success'
                                                                color="success"
                                                                onClick={() => loadDataForEdit(item.id)}
                                                                disabled={isLoading}
                                                            >
                                                                <FaPencilAlt />
                                                            </Button>
                                                            <Button
                                                                className='error'
                                                                color="error"
                                                                onClick={() => confirmDelete(item.id)}
                                                                disabled={isLoading}
                                                            >
                                                                <MdDelete />
                                                            </Button>
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

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this product spicy?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddProductSpicy;