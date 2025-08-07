import { Breadcrumbs, Chip, emphasize, styled } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import React, { useEffect, useState, useContext } from 'react';
import { editData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { FormControl, Select, MenuItem } from '@mui/material';
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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [orders, setOrders] = useState([]);
    const [setPage] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
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

    const handleChange = (event, value) => {
        setPage(value);
        fetchDataFromApi(`/api/orders?page=${value}&perPage=8`).then((res) => {
            setOrders(res);
            context.setProgress(100);
        })
    };

    const updateOrderStatus = async (id, newStatus) => {
        setUpdatingOrderId(id);
        try {
            const res = await editData(`/api/orders/${id}`, { status: newStatus });
            if (res.success) {
                setOrders((prevOrders) => {
                    const updatedList = prevOrders.ordersList.map(order =>
                        order._id === id
                            ? { ...order, paymentDetails: { ...order.paymentDetails, status: newStatus } }
                            : order
                    );
                    return { ...prevOrders, ordersList: updatedList };
                });

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Order status updated successfully!'
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.message || 'Failed to update status.'
                });
            }
        } catch (err) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Error while updating status.'
            });
        } finally {
            setUpdatingOrderId(null);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi("/api/orders?page=1&perPage=8").then(res => {
            setOrders(res);
        })
    }, []);

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Orders</h5>
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
                        label="Orders"
                        component="a"
                        href="/orders"
                    />
                </Breadcrumbs>
            </div>
            <div className="card shadow border-0 p-3 mt-4">
                <div className='table-responsive mt-3'>
                    <table
                        className='table table-bordered table-striped v-align'
                        style={{ whiteSpace: 'nowrap' }}
                    >
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
                </div>
                <Dialog
                    open={openDialog}
                    disableEnforceFocus
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
                    disableEnforceFocus
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
                            👤Customer Details
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
        </div>
    )
}

export default Orders;