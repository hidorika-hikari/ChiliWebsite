import { FaPencilAlt, FaHome} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { Breadcrumbs, Chip, CircularProgress, emphasize, styled, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from '@mui/material';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';

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

const SubCategoryList = () => {

    const context = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [subCatData, setSubCatData] = useState([]);

    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);
        fetchDataFromApi(`/api/subCat?page=${value}`).then((res) => {
            setSubCatData(res);
        })
    };

    const handleOpenDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setDeleteId(null);
        setOpenDelete(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi('/api/subCat').then((res) => {
            setSubCatData(res);
        })
    }, [context]);

    const handleClose = () => {
        setOpen(false);
    };

    const editSubCategory = (id) => {
        setFromFields({
            subCat: '',
        });
        setOpen(true);
        setEditId(id);
        fetchDataFromApi(`/api/subCat/${id}`).then((res) => {
            setFromFields({
                subCat: res.subCat
            });
        })
    }

    const SubcategoryEditFunc = (e) => {
        e.preventDefault();
        setIsLoading(true);
        context.setProgress(40);

        editData(`/api/subCat/${editId}`, formFields)
            .then((res) => {
                fetchDataFromApi('/api/subCat')
                    .then((res) => {
                        setSubCatData(res);
                        setOpen(false);
                        setIsLoading(false);
                    })
                    .catch(() => {
                        setIsLoading(false);
                        context.setAlertBox({ open: true, error: true, msg: 'Failed to fetch updated subcategories.' });
                    });

                context.setAlertBox({ open: true, error: false, msg: 'Subcategory updated!' });
                context.setProgress(100);
            })
            .catch((err) => {
                setIsLoading(false);
                context.setProgress(100);
                context.setAlertBox({ open: true, error: true, msg: 'Error: Failed to update subcategory. Please try again later.' });
                console.error("Subcategory update error:", err);
            });
    };

    const [formFields, setFromFields] = useState({
        subCat: '',
    });

    const changeInput = (e) => {
        setFromFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))
    }

    const deleteSubCat = () => {
        deleteData(`/api/subCat/${deleteId}`)
            .then(res => {
                fetchDataFromApi(`/api/subCat`).then((res) => {
                    setSubCatData(res);
                    context.setAlertBox({ open: true, error: false, msg: 'Subcategory deleted successfully!' });
                    handleCloseDelete();
                })
            })
            .catch((err) => {
                context.setAlertBox({ open: true, error: true, msg: 'Error: Failed to delete subcategory.' });
                console.error("Delete Subcategory error:", err);
                handleCloseDelete();
            });
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                    <h5 className="mb-0">Subcategory List</h5>
                    <div className='ms-auto d-flex align-items-center'>
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
                                label="Subcategory"
                                component="a"
                                href="#"
                            />
                        </Breadcrumbs>
                        <Link to="/subCategory/add"><Button className='btn-blue ms-3 ps-5 pe-5'>
                            Add Subcategory</Button></Link>
                    </div>
                </div>
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="table-dark">
                                <tr>
                                    <th>IMAGE</th>
                                    <th>CATEGORY</th>
                                    <th>SUB CATEGORY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    subCatData?.subCategoryList?.length > 0 && subCatData.subCategoryList.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0" style={{ width: '100px', height: '100px', overflow: 'auto' }}>
                                                                <img
                                                                    src={item.category.images[0]}
                                                                    alt=""
                                                                    className="w-full h-full"
                                                                    style={{ width: 'auto', height: 'auto', display: 'block', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.category.name}</td>
                                                <td>{item.subCat}</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button
                                                            className="success"
                                                            color="success"
                                                            onClick={() => editSubCategory(item.id)}
                                                        >
                                                            <FaPencilAlt />
                                                        </Button>
                                                        <Button
                                                            className="error"
                                                            color="error"
                                                            onClick={() => handleOpenDelete(item.id)}
                                                        >
                                                            <MdDelete />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            subCatData?.totalPages > 1 &&
                            <div className="d-flex justify-content-end mt-3">
                                <Pagination
                                    count={subCatData?.totalPages || 1}
                                    page={page}
                                    color="primary"
                                    className="pagination"
                                    showFirstButton
                                    showLastButton
                                    onChange={handleChange}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                className='editModel'
            >
                <DialogTitle>Edit Subcategory</DialogTitle>
                <form>
                    <DialogContent>
                        <div className='form-group mb-3'>
                            <TextField
                                autoFocus
                                required
                                id="subCat"
                                name="subCat"
                                label="Sub Category"
                                type="text"
                                fullWidth
                                value={formFields.subCat}
                                onChange={changeInput}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant='outlined'>Cancel</Button>
                        <Button type="button" onClick={SubcategoryEditFunc}
                            variant='contained'>
                            {isLoading === true ? <CircularProgress color='inherit'
                                className='ms-3 loader' /> : 'Update'}
                        </Button>
                    </DialogActions>
                </form>
                <br />
            </Dialog>
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this subcategory?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined">Cancel</Button>
                    <Button onClick={deleteSubCat} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SubCategoryList;