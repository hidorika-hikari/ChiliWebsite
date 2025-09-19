import React, { useEffect, useState, useContext } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider, Pagination, Card, CardContent, Stack, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FaListCheck } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const Orders = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [orders, setOrders] = useState({ ordersList: [], totalPages: 0 });
  const [page, setPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const fetchOrders = async (pageNum) => {
    if (!userId) {
      setOrders({ ordersList: [], totalPages: 0 });
      return;
    }

    setLoading(true);

    try {
      const res = await fetchDataFromApi(`/api/orders?page=${pageNum}&perPage=8&userId=${userId}`);
      setOrders(res);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Failed to load orders. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
    fetchOrders(value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders(page);
  }, [userId]);

  return (
    <section className="section">
      <div className="container">
        <h2 className="hd mb-3">Orders</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders?.ordersList?.length > 0 ? (
          <>
            {isSmallScreen ? (
              <Stack spacing={2} className="mt-3">
                {orders.ordersList.map((order) => (
                  <Card key={order._id} variant="outlined">
                    <CardContent>
                      <Stack spacing={1.25}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">Order</Typography>
                          <Chip size="small" label={dayjs.unix(order.paymentDetails.created).tz("Asia/Bangkok").format("DD/MM/YY HH:mm")} />
                        </Stack>
                        <Button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => context.setAlertBox({ open: true, error: false, msg: `Order ID: ${order._id}` })}
                          variant="outlined"
                          size="small"
                        >
                          #{order._id.slice(0, 8)}
                        </Button>
                        <Button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => context.setAlertBox({ open: true, error: false, msg: `Payment ID: ${order.paymentDetails.paymentIntentId}` })}
                          variant="outlined"
                          size="small"
                        >
                          Payment: {order.paymentDetails.paymentIntentId.slice(0, 10)}
                        </Button>
                        <div>
                          <Typography variant="caption" color="text.secondary">Products</Typography>
                          <Stack spacing={0.5} mt={0.5}>
                            {order.cartItems.map((item, idx) => (
                              <Button
                                key={idx}
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleOpenDialog("product", item)}
                                variant="outlined"
                                size="small"
                                style={{ justifyContent: 'flex-start' }}
                              >
                                {item.productTitle.slice(0, 30)}
                              </Button>
                            ))}
                          </Stack>
                        </div>
                        <div>
                          <Typography variant="caption" color="text.secondary">Customer</Typography><br />
                          <Button
                            className="btn btn-sm btn-outline-dark w-100"
                            onClick={() => handleOpenDialog("address", order.billingDetails)}
                            variant="outlined"
                            size="small"
                            style={{ justifyContent: 'flex-start', marginTop: 4 }}
                          >
                            {order.billingDetails.streetAddressLine1.slice(0, 30)}
                          </Button>
                        </div>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                          <Typography variant="body2"><strong>{order.totalAmount} ฿</strong></Typography>
                          <Typography variant="body2">@{order.user.name}</Typography>
                        </Stack>
                        <Link to={`/order-status/${order._id}`}>
                          <Button className="btn btn-sm btn-outline-info" variant="outlined" size="small" fullWidth>
                            View Status
                          </Button>
                        </Link>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <div className="table-responsive orderTable mt-3">
                <table className="table table-striped table-borderless">
                  <thead className="table-dark">
                    <tr>
                      <th>Order ID</th>
                      <th>Payment ID</th>
                      <th>Products</th>
                      <th>Delivery Information</th>
                      <th>Total Amount</th>
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
                            onClick={() =>
                              context.setAlertBox({ open: true, error: false, msg: `Order ID: ${order._id}` })
                            }
                          >
                            {order._id.slice(0, 8)}...
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-dark"
                            style={{ display: "block", width: "100%", textAlign: "left" }}
                            onClick={() =>
                              context.setAlertBox({ open: true, error: false, msg: `Payment ID: ${order.paymentDetails.paymentIntentId}` })
                            }
                          >
                            {order.paymentDetails.paymentIntentId.slice(0, 10)}...
                          </button>
                        </td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {order.cartItems.map((item, idx) => (
                              <li key={idx} style={{ marginBottom: "0.25rem" }}>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleOpenDialog("product", item)}
                                  style={{ display: "block", width: "100%", textAlign: "left" }}
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
                            style={{ display: "block", width: "100%", textAlign: "left" }}
                            onClick={() => handleOpenDialog("address", order.billingDetails)}
                          >
                            {order.billingDetails.streetAddressLine1.slice(0, 30)}...
                          </button>
                        </td>
                        <td>{order.totalAmount} ฿</td>
                        <td>
                          <Link to={`/order-status/${order._id}`}>
                            <button className="btn btn-sm btn-outline-danger">View Status</button>
                          </Link>
                        </td>
                        <td>
                          {dayjs
                            .unix(order.paymentDetails.created)
                            .tz("Asia/Bangkok")
                            .format("DD/MM/YY HH:mm")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {orders?.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination
                  count={orders.totalPages}
                  page={page}
                  onChange={handleChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  disabled={loading}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="empty d-flex flex-column align-items-center justify-content-center text-center py-5">
            <FaListCheck size={120} className="mb-3 text-muted" />
            <h3 className="mb-3">Your Order is currently empty</h3>
            <Link to="/">
              <Button className="btn-blue bg-red btn-lg btn-big btn-round">
                <FaHome /> &nbsp; Continue Shopping
              </Button>
            </Link>
          </div>
        )}

        <Dialog
          open={openDialog}
          onClose={() => handleCloseDialog("product")}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              minHeight: "50vh",
              maxHeight: "85vh",
              padding: 2,
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Product Details
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent dividers sx={{ overflowY: "auto" }}>
            {selectedProduct && (
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  {selectedProduct.images ? (
                    <img
                      src={selectedProduct.images}
                      alt={selectedProduct.productTitle}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "250px",
                        objectFit: "contain",
                        borderRadius: 6,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                    <strong>{selectedProduct.productTitle}</strong>
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    <strong>Price:</strong> {`${selectedProduct.price}฿, x${selectedProduct.quantity}`}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCloseDialog("product")}
              className="btn-red btn-sml btn-lg w-100"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openAddressDialog}
          onClose={() => handleCloseDialog("address")}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              minHeight: "30vh",
              maxHeight: "60vh",
              padding: 2,
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Delivery Information
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent dividers sx={{ overflowY: "auto" }}>
            {selectedAddress && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" mb={1}>
                    <strong>Name:</strong> {`${selectedAddress.fullName}, ${selectedAddress.phoneNumber}`}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    <strong>Address:</strong> {`${selectedAddress.streetAddressLine1}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zipCode}, ${selectedAddress.country}`}
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    <strong>Email:</strong> {selectedAddress.email}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCloseDialog("address")}
              className="btn-red btn-sml btn-lg w-100"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
};

export default Orders;