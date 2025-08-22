import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Pagination from '@mui/material/Pagination';
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
    const [subCatData, setSubCatData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20)
        fetchDataFromApi('/api/subCat').then((res) => {
            setSubCatData(res);
            context.setProgress(100);
        })
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const editSubCategory = (id) => {
        setFromFields({
            subCat:'',
        });
        setOpen(true);
        setEditId(id);
        fetchDataFromApi(`/api/subCat/${id}`).then((res) => {
            setFromFields({
                subCat:res.subCat
            });
        })
    }

    const categoryEditFunc = (e) => {
        e.preventDefault();
        setIsLoading(true);
        context.setProgress(40);
        editData(`/api/subCat/${editId}`, formFields).then((res) => {
            fetchDataFromApi('/api/subCat').then((res) => {
                setSubCatData(res);
                setOpen(false);
                setIsLoading(false);
            });

            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Category updated!'
            });
            context.setProgress(100);
        })
    }

    const [formFields, setFromFields] = useState({
        subCat:'',
    });

    const changeInput = (e) => {
        setFromFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))
    }

    const deleteSubCat = (id) => {
        deleteData(`/api/subCat/${id}`).then(res => {
            fetchDataFromApi(`/api/subCat`).then((res) => {
                setSubCatData(res);
            })
        })
    }

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/subCat?page=${value}`).then((res) => {
            setSubCatData(res);
            context.setProgress(100);
        })
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
                                                            onClick={() => deleteSubCat(item.id)}
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
                            <div className="d-flex tableFooter">
                                <Pagination
                                    count={subCatData?.totalPages}
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
                        <Button type="button" onClick={categoryEditFunc}
                            variant='contained'>
                            {isLoading === true ? <CircularProgress color='inherit'
                                className='ms-3 loader' /> : 'Submit'}
                        </Button>
                    </DialogActions>
                </form>
                <br />
            </Dialog>
        </>
    );
};

export default SubCategoryList;