import { FaHome } from 'react-icons/fa';
import React, { useEffect, useState, useContext } from 'react';
import { editData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import { Breadcrumbs, Chip, emphasize, styled, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider
    , FormControl, Select, MenuItem, Pagination, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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

const menuProps = {
    disableAutoFocusItem: true,
    disableEnforceFocus: true,
};

const Orders = () => {
    const context = useContext(MyContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const handleChange = (event, value) => {
        setPage(value);
        fetchOrders(value);
    };

    const fetchOrders = (pageNumber = 1) => {
        setIsLoading(true);
        fetchDataFromApi(`/api/orders?page=${pageNumber}&perPage=8`)
            .then(res => {
                setOrders(res);
                setError(null);
            })
            .catch(() => {
                setOrders([]);
                setError("Failed to load orders.");
            })
            .finally(() => setIsLoading(false));
    };

    const updateOrderStatus = async (id, newStatus) => {
        setUpdatingOrderId(id);
        try {
            const res = await editData(`/api/orders/${id}`, { status: newStatus });
            if (res.success) {
                setOrders(prevOrders => {
                    const updatedList = prevOrders.ordersList.map(order =>
                        order._id === id
                            ? { ...order, paymentDetails: { ...order.paymentDetails, status: newStatus } }
                            : order
                    );
                    return { ...prevOrders, ordersList: updatedList };
                });
                context.setAlertBox({ open: true, error: false, msg: 'Order status updated successfully!' });
            } else {
                context.setAlertBox({ open: true, error: true, msg: 'Failed to update status.' });
            }
        } catch {
            context.setAlertBox({ open: true, error: true, msg: 'Error while updating status.' });
        } finally {
            setUpdatingOrderId(null);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrders();
    }, []);

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Orders</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                    <StyleBreadcrumb component="a" href={'/'} label="Dashboard" icon={<FaHome fontSize="small" />} />
                    <StyleBreadcrumb label="Orders" component="a" href="/orders" />
                </Breadcrumbs>
            </div>

            <div className="card shadow border-0 p-3 mt-4">
                {isLoading ? (
                    <div className="text-center py-5">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <div className="text-center py-5 text-danger">
                        {error} <Button onClick={() => fetchOrders(page)}>Retry</Button>
                    </div>
                ) : orders?.ordersList?.length === 0 ? (
                    <div className="text-center py-5">No orders found.</div>
                ) : (
                    <div className='table-responsive mt-3'>
                        <table className='table table-bordered table-striped v-align' style={{ whiteSpace: 'nowrap' }}>
                            <thead className='table-dark'>
                                <tr>
                                    <th>Order Id</th>
                                    <th>Payment Id</th>
                                    <th>Products</th>
                                    <th>Customer Details</th>
                                    <th>Total Amount</th>
                                    <th>User</th>
                                    <th>Order Status</th>
                                    <th>Date / Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.ordersList.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => context.setAlertBox({ open: true, error: false, msg: `Order ID: ${order._id}` })}
                                            >
                                                {order._id.slice(0, 8)}...
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-dark"
                                                style={{ display: 'block', width: '100%', textAlign: 'left' }}
                                                onClick={() => context.setAlertBox({ open: true, error: false, msg: `Payment ID: ${order.paymentDetails.paymentIntentId}` })}
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
                                            <FormControl size="small" fullWidth>
                                                <Select
                                                    value={order.paymentDetails.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    disabled={updatingOrderId === order._id}
                                                    MenuProps={menuProps}
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="processing">Processing</MenuItem>
                                                    <MenuItem value="shipped">Shipped</MenuItem>
                                                    <MenuItem value="delivered">Delivered</MenuItem>
                                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                                    <MenuItem value="succeeded">Succeeded</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </td>
                                        <td>{dayjs.unix(order.paymentDetails.created).tz('Asia/Bangkok').format('DD/MM/YY HH:mm')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders?.orderList?.totalPages > 1 && (
                            <div className='d-flex tableFooter'>
                                <Pagination
                                    count={orders.orderList.totalPages}
                                    color='primary'
                                    className='pagination'
                                    showFirstButton showLastButton
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>
                )}

                <Dialog open={openDialog} disableEnforceFocus onClose={() => handleCloseDialog('product')} maxWidth="sm" fullWidth>
                    <DialogTitle>🛒 Product Details</DialogTitle>
                    <Divider />
                    <DialogContent dividers sx={{ overflowY: 'auto' }}>
                        {selectedProduct ? (
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    {selectedProduct.images ? (
                                        <img
                                            src={selectedProduct.images}
                                            alt={selectedProduct.productTitle}
                                            style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        />
                                    ) : <Typography>No image available</Typography>}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" fontWeight="medium">{selectedProduct.productTitle}</Typography>
                                    <Typography><strong>Product ID:</strong> {selectedProduct.productId}</Typography>
                                    <Typography><strong>Quantity:</strong> {selectedProduct.quantity}</Typography>
                                    <Typography><strong>Price:</strong> {selectedProduct.price} ฿</Typography>
                                </Grid>
                            </Grid>
                        ) : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCloseDialog('product')} className="btn-blue w-100">Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openAddressDialog} disableEnforceFocus maxWidth="sm" fullWidth onClose={() => handleCloseDialog('address')}>
                    <DialogTitle>👤 Customer Details</DialogTitle>
                    <Divider />
                    <DialogContent dividers sx={{ overflowY: 'auto' }}>
                        {selectedAddress && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography><strong>Full Name:</strong> {selectedAddress.fullName}</Typography>
                                    <Typography><strong>Phone Number:</strong> {selectedAddress.phoneNumber}</Typography>
                                    <Typography><strong>Street Address:</strong> {selectedAddress.streetAddressLine1}</Typography>
                                    <Typography><strong>Email:</strong> {selectedAddress.email}</Typography>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCloseDialog('address')} className="btn-blue w-100">Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default Orders;