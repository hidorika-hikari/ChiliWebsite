import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import QuantityBox from "../../Components/QuantityDrop";
import { IoIosClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { IoBagCheckOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        fetchDataFromApi(`/api/cart`).then((res) => {
            setCartData(res);
        });
    }, []);

    const handleQuantityChange = (itemId, newQty) => {
        setCartData(prevCartData =>
            prevCartData.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQty, subTotal: item.price * newQty }
                    : item
            )
        );
        const user = JSON.parse(localStorage.getItem("user"));
        const item = cartData.find(item => item.id === itemId);

        if (!item) return;
        const updatedFields = {
            quantity: newQty,
            subTotal: newQty * item.price,
            userId: user?.userId
        };
        editData(`/api/cart/${itemId}`, updatedFields)
            .then(res => console.log('Quantity updated in DB:', updatedFields))
            .catch(err => console.error('Failed to update quantity in DB:', err));
    };

    const removeItem = (id) => {
        deleteData(`/api/cart/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Item remove form cart"
            })
            fetchDataFromApi(`/api/cart`).then((res) => {
                setCartData(res);
            })
            context.getCartData();
        })
    }
    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <h2 className="hd mb-2">Cart</h2>
                    <p>There are <b className="text-red">{cartData.length}</b> products in your cart</p>
                    <div className="row">
                        <div className="col-md-9 pe-5">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className="table-dark text-white">
                                        <tr>
                                            <th width="35%">Product</th>
                                            <th width="15%">Unit Price</th>
                                            <th width="25%" style={{ paddingLeft: '35px' }}>Quantity</th>
                                            <th width="15%">Subtotal</th>
                                            <th width="10%">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cartData.length !== 0 && cartData.map((item) => (
                                                <tr key={item.id}>
                                                    <td width="35%">
                                                        <Link to={`/product/${item.id}`}>
                                                            <div className="d-flex align-items-center cartItemImgWrapper">
                                                                <div className="imgWrapper">
                                                                    <img src={item.images} className="w-100" alt={item.productTitle} />
                                                                </div>
                                                                <div className="info px-3">
                                                                    <h6>{item.productTitle?.substr(0, 30) + '...'}</h6>
                                                                    <Rating name="read-only" value={item.rating} readOnly precision={0.5} size="small" />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td width="15%">{item.price} ฿</td>
                                                    <td width="25%">
                                                        <QuantityBox
                                                            quantity={item.quantity}
                                                            onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                                                        />
                                                    </td>
                                                    <td width="15%">{item.subTotal} ฿</td>
                                                    <td width="10%"><span className="remove" onClick={() => removeItem(item?._id)}><IoIosClose /></span></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="card border p-3 cartDetails">
                                <h4>CART TOTALS</h4>
                                <div className="d-flex align-items-center mb-3">
                                    <span>Subtotal</span>
                                    <span className="ms-auto text-red fw-bold">
                                        {cartData.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2)} ฿
                                    </span>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <span>Shipping</span>
                                    <span className="ms-auto"><b>Free</b></span>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <span>Estimate For</span>
                                    <span className="ms-auto"><b>UK</b></span>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <span>Total</span>
                                    <span className="ms-auto text-red fw-bold">
                                        {cartData.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2)} ฿
                                    </span>
                                </div>

                                <Button className="btn-blue bg-red btn-lg btn-big">
                                    <IoBagCheckOutline  />&nbsp; Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Cart;