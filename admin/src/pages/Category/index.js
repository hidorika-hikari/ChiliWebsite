import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import { deleteData, editData, fetchDataFromApi } from '../../ultils/api';
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

const Category = () => {
    const [catData, setCatData] = useState([]);
    const [open, setOpen] = useState(false);
    // const [page, setPage] = useState(1);
    // const [editFields, setEditFields] = useState({});
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20)
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            console.log(res);
            context.setProgress(100);
        })
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const editCategory = (id) => {
        setFromFields({
            name: '',
            images: '',
            color: ''
        });
        setOpen(true);
        setEditId(id);
        fetchDataFromApi(`/api/category/${id}`).then((res) => {
            setFromFields({
                name: res.name,
                images: res.images,
                color: res.color
            });
            console.log(res);
        })
    }

    const categoryEditFunc = (e) => {
        e.preventDefault();
        setIsLoading(true);
        context.setProgress(40);
        editData(`/api/category/${editId}`, formFields).then((res) => {
            fetchDataFromApi('/api/category').then((res) => {
                setCatData(res);
                setOpen(false);
                setIsLoading(false);
            });

            context.setAlertBox({
                open: true,
                error: false,
                msg: 'The Category Updated!'
            });
            context.setProgress(100);
        })
    }

    const [formFields, setFromFields] = useState({
        name: '',
        images: [],
        color: ''
    });

    const changeInput = (e) => {
        setFromFields(() => (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))
    }

    const addImgUrl = (e) => {
        const arr = [];
        arr.push(e.target.value);
        setFromFields(() => (
            {
                ...formFields,
                [e.target.name]: arr
            }
        ))
    }

    const deleteCat = (id) => {
        deleteData(`/api/category/${id}`).then(res => {
            fetchDataFromApi(`/api/category`).then((res) => {
                setCatData(res);
            })
        })
    }

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/category?page=${value}`).then((res) => {
            setCatData(res);
            context.setProgress(100);
        })
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Category List</h5>
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
                                label="Category"
                                component="a"
                                href="#"
                            />
                        </Breadcrumbs>
                        <Link to="/category/add"><Button className='btn-blue ms-3 ps-5 pe-5'>
                            Add Category</Button></Link>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="table-dark">
                                <tr>
                                    <th>UID</th>
                                    <th>IMAGE</th>
                                    <th>CATEGORY</th>
                                    <th>COLOR</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    catData?.categoryList?.length > 0 && catData.categoryList.map((item, index) => {
                                        return (
                                            <tr>
                                                <td><span>#{index + 1}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0" style={{ width: '100px', height: '100px', overflow: 'auto' }}>
                                                                <img
                                                                    src={item.images[0]}
                                                                    alt=""
                                                                    className="w-full h-full"
                                                                    style={{ width: 'auto', height: 'auto', display: 'block', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.color}</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button
                                                            className="success"
                                                            color="success"
                                                            onClick={() => editCategory(item.id)}
                                                        >
                                                            <FaPencilAlt />
                                                        </Button>
                                                        <Button
                                                            className="error"
                                                            color="error"
                                                            onClick={() => deleteCat(item.id)}
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

                        <div className="d-flex tableFooter">
                            <Pagination
                                count={catData?.totalPages}
                                color="primary"
                                className="pagination"
                                showFirstButton
                                showLastButton
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                className='editModel'
            >
                <DialogTitle>Edit Category</DialogTitle>
                <form>
                    <DialogContent>
                        <div className='form-group mb-3'>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="name"
                                label="Category Name"
                                type="text"
                                fullWidth
                                value={formFields.name}
                                onChange={changeInput}
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="images"
                                name="images"
                                label="Category Image"
                                type="text"
                                fullWidth
                                value={formFields.images}
                                onChange={addImgUrl}
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="color"
                                name="color"
                                label="Category Color"
                                type="text"
                                fullWidth
                                value={formFields.color}
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

export default Category;
