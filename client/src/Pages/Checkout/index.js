import { Button, TextField } from '@mui/material';
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
    })

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            setCartData(res);
        });
    }, []);

    const context = useContext(MyContext);
    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        const amount = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100;
        const res = await fetch('http://localhost:4000/api/payment/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency: 'thb' }),
        });
        const { clientSecret } = await res.json();
        const cardElement = elements.getElement(CardElement);
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });
        setProcessing(false);
        if (paymentResult.error) {
            context.setAlertBox({ open: true, error: true, msg: paymentResult.error.message });
        } else if (paymentResult.paymentIntent.status === 'succeeded') {
            context.setAlertBox({ open: true, error: false, msg: 'Payment successfully!' });
        }
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
        postData(`/api/orders/create`,payload).then(res => {
            history('/');
        })
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
                                        <TextField label='Full name' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='fullName'
                                            onChange={onChangeInput}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField label='Country *' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='country'
                                            onChange={onChangeInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <h6>Street address *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label='House number and street name' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='streetAddressLine1'
                                            onChange={onChangeInput} />
                                    </div>
                                    <div className='form-group'>
                                        <TextField label='Apartment, suite, unit , etc. (optional)' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='streetAddressLine2'
                                            onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <h6>Town / City *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label='City' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='city'
                                            onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <h6>State / Country *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label='State' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='state'
                                            onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <h6>Postcode / Zip *</h6>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='form-group'>
                                        <TextField label='Zip Code' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='zipCode'
                                            onChange={onChangeInput} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField label='Phone Number' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='phoneNumber'
                                            onChange={onChangeInput} />
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group'>
                                        <TextField label='Email Address' variant='outlined'
                                            className='w-100'
                                            size='small'
                                            name='email'
                                            onChange={onChangeInput} />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='orderInfo'>
                                <h4>YOUR ORDER</h4>
                                <div className='table-responsive mt-3'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th className="fw-medium">Product</th>
                                                <th className="fw-medium">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartData?.length > 0 && cartData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {item?.productTitle?.length > 30
                                                            ? item.productTitle.substr(0, 30) + '...'
                                                            : item.productTitle
                                                        }
                                                        <b> × {item.quantity}</b>
                                                    </td>
                                                    <td>{item.price}฿</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="fw-medium">Subtotal</td>
                                                <td>
                                                    {cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0)}฿
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="form-group">
                                    <h6 className='mb-3 fw-medium'>Credit or debit card:</h6>
                                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                                </div>
                                <Button className='btn-red btn-lg btn-big w-100' type="submit" disabled={!stripe || processing}>
                                    {processing ? <span className="text-white">Processing...</span> : <><IoBagCheckOutline /> &nbsp; Checkout</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Checkout;