import React, { useEffect, useState, useContext } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const Orders = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const context = useContext(MyContext);

    const handleOpenDialog = (type, data) => {
        if (type === 'product') {
            setSelectedProduct(data);
            setOpenDialog(true);
        } else if (type === 'address') {
            setSelectedAddress(data);
            setOpenAddressDialog(true);
        }
    };

    const handleCloseDialog = (type) => {
        if (type === 'product') {
            setSelectedProduct(null);
            setOpenDialog(false);
        } else if (type === 'address') {
            setSelectedAddress(null);
            setOpenAddressDialog(false);
        }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    const handleChange = (event, value) => {
        setPage(value);
        if (userId) {
            fetchDataFromApi(`/api/orders?page=${value}&perPage=8&userId=${userId}`).then((res) => {
                setOrders(res);
                context.setProgress(100);
            });
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-secondary';
            case 'processing':
                return 'bg-warning text-dark';
            case 'shipped':
                return 'bg-info text-dark';
            case 'delivered':
                return 'bg-primary';
            case 'cancelled':
                return 'bg-danger';
            case 'succeeded':
                return 'bg-success';
            default:
                return 'bg-dark';
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (userId) {
            fetchDataFromApi(`/api/orders?page=1&perPage=8&userId=${userId}`).then(res => {
                setOrders(res);
            });
        } else {
            setOrders([]);
        }
    }, [userId]);

    return (
        <section className='section'>
            <div className="container">
                <h2 className='hd'>Orders</h2>
                <div className='table-responsive orderTable mt-3'>
                    <table className='table table-striped table-borderless'>
                        <thead className='table-dark'>
                            <tr>
                                <th>Order Id</th>
                                <th>Paymant Id</th>
                                <th>Products</th>
                                <th>Customer Details</th>
                                <th>Total Amount</th>
                                <th>User</th>
                                <th>Order Status</th>
                                <th>Date / Time</th>
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
                                            style={{ display: 'block', width: '100%', textAlign: 'left' }}
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
                                                <li key={idx} style={{ marginBottom: '0.25rem' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleOpenDialog('product', item)}
                                                        style={{ display: 'block', width: '100%', textAlign: 'left' }}
                                                    >
                                                        {item.productTitle.slice(0, 30)}...
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-dark"
                                            style={{ display: 'block', width: '100%', textAlign: 'left' }}
                                            onClick={() => handleOpenDialog('address', order.billingDetails)}
                                        >
                                            {order.billingDetails.streetAddressLine1.slice(0, 30)}...
                                        </button>
                                    </td>
                                    <td>{order.totalAmount} ฿</td>
                                    <td>{order.user.name}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(order.paymentDetails.status)}`}>
                                            {order.paymentDetails.status.charAt(0).toUpperCase() + order.paymentDetails.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>{dayjs.unix(order.paymentDetails.created).tz('Asia/Bangkok').format('DD/MM/YY HH:mm')}</td>
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
                    sx={{
                        '& .MuiDialog-paper': {
                            minHeight: '50vh',
                            maxHeight: '85vh',
                            padding: 2,
                            borderRadius: 2,
                        },
                    }}
                >
                    <DialogTitle>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🛒 Product Details
                        </Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent dividers sx={{ overflowY: 'auto' }}>
                        {selectedProduct && (
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    {selectedProduct.images ? (
                                        <img
                                            src={selectedProduct.images}
                                            alt={selectedProduct.productTitle}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '250px',
                                                objectFit: 'contain',
                                                borderRadius: 6,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            No image available
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} className="product-info">
                                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                        {selectedProduct.productTitle}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        <strong>Product ID:</strong>{' '}
                                        <span className="text-monospace">{selectedProduct.productId}</span>
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        <strong>Quantity:</strong> {selectedProduct.quantity}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        <strong>Price:</strong> {selectedProduct.price} ฿
                                    </Typography>
                                </Grid>

                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCloseDialog('product')} className="btn-blue btn-sml btn-lg w-100">
                            Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openAddressDialog}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            minHeight: '30vh',
                            maxHeight: '60vh',
                            padding: 2,
                            borderRadius: 2,
                        },
                    }}
                >
                    <DialogTitle>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            👤 Customer Details
                        </Typography>
                    </DialogTitle>
                    <Divider />
                    <DialogContent dividers sx={{ overflowY: 'auto' }}>
                        {selectedAddress && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" mb={1}>
                                        <strong>Full Name:</strong> {selectedAddress.fullName}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        <strong>Phone Number:</strong> {selectedAddress.phoneNumber}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        <strong>Street Address:</strong> {selectedAddress.streetAddressLine1}
                                    </Typography>
                                    <Typography variant="body2" mb={1}>
                                        <strong>Email:</strong> {selectedAddress.email}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCloseDialog('address')}
                            className="btn-blue btn-sml btn-lg w-100">Close</Button>
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