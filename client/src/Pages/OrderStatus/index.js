import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Divider, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { FaClipboardList } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";
import { Cancel, LocalShipping, Payments, ShoppingBag } from "@mui/icons-material";

const steps = [
    { key: "succeeded", label: "Payment Completed", icon: <Payments /> },
    { key: "pending", label: "Order Placed", icon: <FaClipboardList /> },
    { key: "processing", label: "In Production", icon: <ShoppingBag /> },
    { key: "shipped", label: "Shipped", icon: <LocalShipping /> },
    { key: "delivered", label: "Delivered", icon: <LocalShipping /> },
];

const OrderStatusPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchDataFromApi(`/api/orders/${orderId}`).then((res) => {
                setOrder(res);
            });
        }
    }, [orderId]);

    const getActiveStep = (status) => {
        if (status === "cancelled") return -1;
        const index = steps.findIndex((s) => s.key === status);
        return index !== -1 ? index : 0;
    };

    if (!order) {
        return (
            <Container sx={{ py: 5 }}>
                <Typography variant="h6">Loading order...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 5 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                🚚 Order Tracking
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
                Track your order status in real-time. Delivery dates may change depending on logistics.
            </Typography>

            <Paper
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    background: "linear-gradient(135deg, #f9fafb, #eef2f7)",
                }}
            >
                <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Typography variant="body1">
                        <strong>Order Placed:</strong>{" "}
                        {new Date(order.paymentDetails.created * 1000).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Total:</strong> {order.totalAmount} ฿
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ship To:</strong> {order.billingDetails.fullName}
                    </Typography>
                    <Typography variant="body1">
                        <strong> Order ID:</strong> {order._id}
                    </Typography>
                </Box>
            </Paper>

            <Typography
                variant="h6"
                gutterBottom
                color={order.paymentDetails.status === "cancelled" ? "error" : "primary"}
            >
                Order Status:{" "}
                {order.paymentDetails.status === "cancelled"
                    ? "Cancelled"
                    : steps.find((s) => s.key === order.paymentDetails.status)?.label ||
                    order.paymentDetails.status}
            </Typography>

            {order.paymentDetails.status === "cancelled" ? (
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: "#fff5f5",
                        border: "1px solid #fca5a5",
                        mb: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Cancel color="error" />
                    <Typography variant="body1" color="error">
                        ❌ This order was cancelled. If you believe this is a mistake,
                        please contact customer support.
                    </Typography>
                </Paper>
            ) : (
                <Stepper
                    activeStep={getActiveStep(order.paymentDetails.status)}
                    alternativeLabel
                    sx={{ mb: 5 }}
                >
                    {steps.map((step, index) => (
                        <Step key={step.key}>
                            <StepLabel
                                icon={step.icon}
                                sx={{
                                    "& .MuiStepLabel-label.Mui-active": {
                                        color: "#1976d2",
                                        fontWeight: "bold",
                                    },
                                    "& .MuiStepLabel-iconContainer.Mui-active": {
                                        color: "#1976d2",
                                    },
                                    "& .MuiStepLabel-iconContainer.Mui-completed": {
                                        color: "#4caf50",
                                    },
                                }}
                            >
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            )}

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 2,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    📦 Shipping Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" mb={1}>
                    <strong>Name:</strong> {order.billingDetails.fullName}
                </Typography>
                <Typography variant="body2" mb={1}>
                    <strong>Phone:</strong> {order.billingDetails.phoneNumber}
                </Typography>
                <Typography variant="body2" mb={2}>
                    <strong>Address:</strong> {order.billingDetails.streetAddressLine1}
                </Typography>

                <Box mt={2}>
                    <iframe
                        title="map"
                        width="100%"
                        height="250"
                        style={{ border: 0, borderRadius: 12 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                            order.billingDetails.streetAddressLine1
                        )}&output=embed`}
                    ></iframe>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderStatusPage;