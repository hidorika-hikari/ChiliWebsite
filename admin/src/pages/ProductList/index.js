import { FaEye, FaPencilAlt, FaHome } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { Breadcrumbs, Chip, emphasize, styled, Button, Pagination, Rating, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { deleteData, fetchDataFromApi } from '../../utils/api';

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

const Products = () => {

    const [productList, setProductList] = useState({
        products: [],
        totalPages: 1,
        page: 1
    });

    const context = useContext(MyContext);

    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOpenDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setDeleteId(null);
        setOpenDelete(false);
    };

    const deleteProduct = () => {
        setIsDeleting(true);
        context.setProgress(40);
        deleteData(`/api/products/${deleteId}`)
            .then(() => {
                fetchDataFromApi("/api/products")
                    .then((res) => setProductList(res))
                    .catch((err) => console.error("Fetch products error:", err));
                context.setAlertBox({ open: true, error: false, msg: 'Product deleted successfully!' });
                setIsDeleting(false);
                handleCloseDelete();
                context.setProgress(100);
            })
            .catch((err) => {
                console.error("Delete product error:", err);
                context.setAlertBox({ open: true, error: true, msg: 'Failed to delete product.' });
                setIsDeleting(false);
                handleCloseDelete();
                context.setProgress(100);
            });
    };

    const handleChange = (event, value) => {
        fetchDataFromApi(`/api/products?page=${value}`)
            .then((res) => {
                setProductList({ ...res });
            })
    };

    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
        fetchDataFromApi("/api/products").then((res) => {
            setProductList(res);
        })
        window.scrollTo(0, 0);
    }, [context]);


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                    <h5 className="mb-0">Product List</h5>
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
                            label="Products"
                            component="a"
                        />
                    </Breadcrumbs>
                    <Link to="/product/add"><Button className='btn-blue btn-lg ms-3 ps-3 pe-3'>
                        Add Product</Button></Link>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '100px' }}>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>SUB CATEGORY</th>
                                    <th>BRAND / TYPE</th>
                                    <th style={{ width: '70px' }}>PRICE</th>
                                    <th>STOCK</th>
                                    <th>RATING</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productList?.products?.length !== 0 && productList?.products?.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0">
                                                                <img
                                                                    src={item.images[0]}
                                                                    alt=""
                                                                    className="w-100"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="info ps-3">
                                                            <h6>{item.name}</h6>
                                                            <p>{item.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.category?.name}</td>
                                                <td>{item.subCat?.subCat}</td>
                                                <td>{item.brand}</td>
                                                <td>
                                                    <del className="old">{item.oldPrice} ฿</del>
                                                    <span className="new text-danger">{item.price} ฿</span>
                                                </td>
                                                <td>{item.countInStock}</td>
                                                <td>
                                                    <Rating
                                                        name="size-small"
                                                        defaultValue={item.rating}
                                                        size="small"
                                                    />
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-ite`ms-center">
                                                        <Link to={`/product/details/${item._id}`}>
                                                            <Button className="secondary" color="secondary">
                                                                <FaEye />
                                                            </Button>
                                                        </Link>
                                                        <Link to={`/product/edit/${item.id}`}>
                                                            <Button
                                                                className="success"
                                                                color="success"
                                                            >
                                                                <FaPencilAlt />
                                                            </Button>
                                                        </Link>
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
                        <Dialog open={openDelete} onClose={handleCloseDelete}>
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogContent>
                                <p>Are you sure you want to delete this product?</p>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDelete} variant="outlined">Cancel</Button>
                                <Button
                                    onClick={deleteProduct}
                                    color="error"
                                    variant="contained"
                                >
                                    {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {
                            productList?.totalPages > 1 &&
                            <div className="d-flex justify-content-end mt-3">
                                <Pagination
                                    count={productList?.totalPages || 1}
                                    page={productList?.page || 1}
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
        </>
    );
};

export default Products;