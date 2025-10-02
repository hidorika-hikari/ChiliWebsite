import { Button, TextField, Box, Typography, Paper  } from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../App';
import { IoBagCheckOutline } from 'react-icons/io5';
import { fetchDataFromApi, postData } from '../../utils/api';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();
    const history = useNavigate();
    const context = useContext(MyContext);

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '14px',
                '::placeholder': {
                    color: '#000',
                },
                backgroundColor: 'white',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
        hidePostalCode: true,
    };

    const [processing, setProcessing] = useState(false);
    const [cartData, setCartData] = useState([]);
    const [cardError, setCardError] = useState('');
    const [cardComplete, setCardComplete] = useState(false);
    const [formFields, setFormFields] = useState({
        fullName: '',
        country: '',
        streetAddressLine1: '',
        streetAddressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        email: ''
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCardChange = (event) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError('');
        }
        setCardComplete(event.complete);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            setCartData(res);
        });
    }, []);

    const validateForm = () => {
        const requiredFields = ['fullName', 'country', 'streetAddressLine1', 'city', 'state', 'zipCode', 'phoneNumber', 'email'];
        const missingFields = requiredFields.filter(field => !formFields[field].trim());
        
        if (missingFields.length > 0) {
            context.setAlertBox({ open: true, error: true, msg: `Please fill in all required fields: ${missingFields.join(', ')}` });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formFields.email)) {
            context.setAlertBox({ open: true, error: true, msg: 'Please enter a valid email address' });
            return false;
        }
        return true;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        if (!stripe || !elements) {
            context.setAlertBox({ open: true, error: true,  msg: 'Stripe is not loaded. Please refresh the page and try again.' });
            return;
        }

        const cardElement = elements.getElement(CardElement);
        
        if (!cardElement) {
            context.setAlertBox({ open: true, error: true, msg: 'Card element not found. Please refresh the page.' });
            return;
        }

        if (!cardComplete) {
            context.setAlertBox({ open: true, error: true, msg: 'Please enter your complete card details.' });
            return;
        }

        if (cardError) {
            context.setAlertBox({ open: true, error: true, msg: cardError });
            return;
        }

        setProcessing(true);
        try {
            const amount = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100;
            
            const res = await fetch('http://localhost:4000/api/payment/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'thb' }),
            });

            if (!res.ok) {
                throw new Error('Failed to create payment intent');
            }

            const { clientSecret } = await res.json();
            
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: formFields.fullName,
                        email: formFields.email,
                        phone: formFields.phoneNumber,
                        address: {
                            line1: formFields.streetAddressLine1,
                            line2: formFields.streetAddressLine2,
                            city: formFields.city,
                            state: formFields.state,
                            postal_code: formFields.zipCode,
                        },
                    },
                },
            });

            setProcessing(false);

            if (paymentResult.error) {
                context.setAlertBox({ open: true, error: true, msg: paymentResult.error.message });
            } else if (paymentResult.paymentIntent.status === 'succeeded') {
                context.setAlertBox({ open: true, error: false, msg: 'Payment successful!' });

                const payload = {
                    user: JSON.parse(localStorage.getItem("user")),
                    billingDetails: formFields,
                    cartItems: cartData.map((item) => ({
                        productId: item.productId,
                        productTitle: item.productTitle,
                        price: item.price,
                        quantity: item.quantity,
                        images: item.images?.[0]
                    })),
                    totalAmount: amount / 100,
                    paymentDetails: {
                        paymentIntentId: paymentResult.paymentIntent.id,
                        status: paymentResult.paymentIntent.status,
                        created: paymentResult.paymentIntent.created,
                    },
                    createdAt: new Date().toISOString()
                };

                try {
                    const res = await postData(`/api/orders/create`, payload);
                    if (!res?.success) {
                        context.setAlertBox({ open: true, error: true, msg: res?.message || 'Unable to place order. Please review your cart.' });
                        return;
                    }
                    history('/');
                } catch (err) {
                    const msg = err?.response?.data?.message || 'Insufficient stock or order could not be created.';
                    context.setAlertBox({ open: true, error: true, msg });
                    return;
                }
            }
        } catch (error) {
            setProcessing(false);
            context.setAlertBox({ open: true, error: true, msg: 'An error occurred during payment processing. Please try again.' });
            console.error('Payment error:', error);
        }
    };

    return (
        <section className='section'>
            <div className='container'>
                <form className='checkoutForm' onSubmit={handlePayment}>
                    <div className='row'>
                        <div className='col-md-8'>
                            <h2 className='hd'>BILLING DETAILS</h2>
                            <div className='row mt-3'>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField
                                            label='Full name'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='fullName'
                                            value={formFields.fullName}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField
                                            label='Country'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='country'
                                            value={formFields.country}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <h6>Street address *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField
                                            label='House number and street name'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='streetAddressLine1'
                                            value={formFields.streetAddressLine1}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <TextField
                                            label='Apartment, suite, unit, etc. (optional)'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='streetAddressLine2'
                                            value={formFields.streetAddressLine2}
                                            onChange={onChangeInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <h6>Town / City *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField
                                            label='City'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='city'
                                            value={formFields.city}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <h6>State / Country *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField
                                            label='State'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='state'
                                            value={formFields.state}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <h6>Postcode / Zip *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField
                                            label='Zip Code'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='zipCode'
                                            value={formFields.zipCode}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField
                                            label='Phone Number'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='phoneNumber'
                                            value={formFields.phoneNumber}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField
                                            label='Email Address'
                                            variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='email'
                                            type='email'
                                            value={formFields.email}
                                            onChange={onChangeInput}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Box className="col-md-4">
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    borderRadius: 3
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    YOUR ORDER
                                </Typography>

                                <Box sx={{ overflowX: "auto" }}>
                                    <table className="table" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th className="fw-medium">Product</th>
                                                <th className="fw-medium">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartData?.length > 0 &&
                                                cartData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {item?.productTitle?.length > 30
                                                                ? item.productTitle.substr(0, 30) + "..."
                                                                : item.productTitle}
                                                            <b> × {item.quantity}</b>
                                                        </td>
                                                        <td>{item.price}฿</td>
                                                    </tr>
                                                ))}
                                            <tr>
                                                <td className="fw-medium">Subtotal</td>
                                                <td>
                                                    {cartData.reduce(
                                                        (sum, item) => sum + item.price * item.quantity,
                                                        0
                                                    )}
                                                    ฿
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                        Credit or debit card *
                                    </Typography>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: cardError ? "1px solid #fa755a" : "1px solid #e0e0e0",
                                            mb: cardError ? 1 : 3,
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        <CardElement
                                            options={CARD_ELEMENT_OPTIONS}
                                            onChange={handleCardChange}
                                        />
                                    </Paper>
                                    
                                    {cardError && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                            sx={{ mb: 2, display: 'block' }}
                                        >
                                            {cardError}
                                        </Typography>
                                    )}

                                    <Button
                                        type='submit'
                                        disabled={!stripe || processing || !cardComplete}
                                        className="btn-red btn-lg btn-big w-100"
                                        sx={{
                                            opacity: (!stripe || processing || !cardComplete) ? 0.6 : 1
                                        }}
                                    >
                                        {processing ? (
                                            <span style={{ color: "#fff" }}>Processing...</span>
                                        ) : (
                                            <>
                                                <IoBagCheckOutline style={{ marginRight: 8 }} />
                                                Check Out
                                            </>
                                        )}
                                    </Button>
                                    
                                    {!cardComplete && !processing && (
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                                        >
                                            Please enter your complete card details to continue
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Checkout;