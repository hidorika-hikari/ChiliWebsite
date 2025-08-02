import React, { useEffect, useState, useContext } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import Pagination from '@mui/material/Pagination';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider } from '@mui/material';

const Orders = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenProductDialog = (product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedProduct(null);
        setOpenDialog(false);
    };

    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const context = useContext(MyContext);
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi("/api/orders?page=1&perPage=8").then(res => {
            setOrders(res);
        })
    }, []);

    const handleChange = (event, value) => {
        setPage(value);
        fetchDataFromApi(`/api/orders?page=${value}&perPage=8`).then((res) => {
            setOrders(res);
            context.setProgress(100);
        })
    };

    return (
        <section className='section'>
            <div className="container">
                <h2 className='hd'>Orders</h2>
                <div className='table-responsive orderTable'>
                    <table className='table table-striped table-bordered'>
                        <thead className='thead-light'>
                            <tr>
                                <th>Order Id</th>
                                <th>Paymant Id</th>
                                <th>Products</th>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Total Amount</th>
                                <th>Email</th>
                                <th>User</th>
                                <th>Order Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.ordersList?.length > 0 && orders.ordersList.map((order, index) => (
                                <tr key={order._id}>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => context.setAlertBox({
                                                open: true,
                                                error: false,
                                                msg: `Order ID: ${order._id}`
                                            })}
                                        >
                                            {order._id.slice(0, 8)}...
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-dark"
                                            onClick={() => context.setAlertBox({
                                                open: true,
                                                error: false,
                                                msg: `Payment ID: ${order.paymentDetails.paymentIntentId}`
                                            })}
                                        >
                                            {order.paymentDetails.paymentIntentId.slice(0, 10)}...
                                        </button>
                                    </td>
                                    <td>
                                        <ul className="list-unstyled mb-0">
                                            {order.cartItems.map((item, idx) => (
                                                <li key={idx}>
                                                    <button
                                                        className="btn btn-link p-0 text-decoration-none text-primary"
                                                        onClick={() => handleOpenProductDialog(item)}
                                                    >
                                                        {item.productTitle}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{order.billingDetails.fullName}</td>
                                    <td>{order.billingDetails.phoneNumber}</td>
                                    <td>{order.billingDetails.streetAddressLine1}</td>
                                    <td>{order.totalAmount} ฿</td>
                                    <td>{order.billingDetails.email}</td>
                                    <td>{order.user.name}</td>
                                    <td>
                                        {order.paymentDetails.status === 'succeeded' ? (
                                            <span className="badge bg-success">Succeeded</span>
                                        ) : (
                                            <span className="badge bg-danger">{order.paymentDetails.status}</span>
                                        )}
                                    </td>
                                    <td>{new Date(order.paymentDetails.created * 1000).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6" component="div">
                            🛒 Product Details
                        </Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent dividers>
                        {selectedProduct && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Product Title:</strong> {selectedProduct.productTitle}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        <strong>Product ID:</strong>{' '}
                                        <span className="text-monospace">{selectedProduct.productId}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        <strong>Quantity:</strong> {selectedProduct.quantity}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>
                                        <strong>Price:</strong> {selectedProduct.price} ฿
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} className='btn-blue btn-sml btn-lg'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {
                    orders?.orderList?.totalPages > 1 &&
                    <div className='d-flex tableFooter'>
                        <Pagination count={orders?.orderList?.totalPages}
                            color='primary'
                            className='pagination'
                            showFirstButton showLastButton
                            onChange={handleChange} />
                    </div>
                }
            </div>
        </section>
    );
};

export default Orders;