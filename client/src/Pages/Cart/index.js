import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityDrop";
import Button from "@mui/material/Button";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaShoppingCart, FaHome } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const context = useContext(MyContext);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
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
      .catch(err => console.error('Failed to update quantity in DB:', err));
  };

  const removeItem = (id) => {
    deleteData(`/api/cart/${id}`)
      .then((res) => {
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Item removed from cart"
        });

        const user = JSON.parse(localStorage.getItem("user"));
        return fetchDataFromApi(`/api/cart?userId=${user?.userId}`);
      })
      .then((res) => {
        setCartData(res);
        context.getCartData();
      })
      .catch((err) => {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Failed to remove item from cart. Please try again."
        });
        console.error("Remove cart item error:", err);
      });
  };

  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <h2 className="hd mb-2">Cart</h2>

          {cartData?.length > 0 ? (
            <>
              <p>
                There are{" "}
                <b className="text-red">{cartData.length}</b> products in your cart
              </p>

              <div className="row">
                <div className="col-md-9 mb-3">
                  {isSmallScreen ? (
                    <Stack spacing={2}>
                      {cartData.map((item) => (
                        <Card key={item.id} variant="outlined">
                          <CardContent>
                            <Stack spacing={1.25}>
                              <Link to={`/product/${item.id}`}>
                                <div className="d-flex align-items-center cartItemImgWrapper">
                                  <div className="imgWrapper" style={{ width: 80 }}>
                                    <img
                                      src={item.images}
                                      className="w-100"
                                      alt={item.productTitle}
                                    />
                                  </div>
                                  <div className="info px-3">
                                    <h6 style={{ marginBottom: 4 }}>
                                      {item.productTitle?.substr(0, 40) + "..."}
                                    </h6>
                                    <Rating
                                      name="read-only"
                                      value={item.rating}
                                      readOnly
                                      precision={0.5}
                                      size="small"
                                    />
                                  </div>
                                </div>
                              </Link>
                              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                <Typography variant="body2">{item.price} ฿</Typography>
                                <QuantityBox
                                  quantity={item.quantity}
                                  onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle2">Subtotal</Typography>
                                <Typography variant="subtitle2">{item.subTotal} ฿</Typography>
                              </Stack>
                              <Button variant="outlined" color="error" onClick={() => removeItem(item?._id)} fullWidth>
                                Remove
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead className="table-dark text-white">
                          <tr>
                            <th width="35%">Product</th>
                            <th width="15%">Unit Price</th>
                            <th width="25%" style={{ paddingLeft: "35px" }}>
                              Quantity
                            </th>
                            <th width="15%">Subtotal</th>
                            <th width="10%">Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartData.map((item) => (
                            <tr key={item.id}>
                              <td width="35%">
                                <Link to={`/product/${item.id}`}>
                                  <div className="d-flex align-items-center cartItemImgWrapper">
                                    <div className="imgWrapper">
                                      <img
                                        src={item.images}
                                        className="w-100"
                                        alt={item.productTitle}
                                      />
                                    </div>
                                    <div className="info px-3">
                                      <h6>
                                        {item.productTitle?.substr(0, 30) + "..."}
                                      </h6>
                                      <Rating
                                        name="read-only"
                                        value={item.rating}
                                        readOnly
                                        precision={0.5}
                                        size="small"
                                      />
                                    </div>
                                  </div>
                                </Link>
                              </td>
                              <td width="15%">{item.price} ฿</td>
                              <td width="25%">
                                <QuantityBox
                                  quantity={item.quantity}
                                  onQuantityChange={(qty) =>
                                    handleQuantityChange(item.id, qty)
                                  }
                                />
                              </td>
                              <td width="15%">{item.subTotal} ฿</td>
                              <td width="10%">
                                <span
                                  className="remove"
                                  onClick={() => removeItem(item?._id)}
                                >
                                  <IoIosClose />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="col-md-3">
                  <div className="card border p-3 cartDetails">
                    <h4>CART TOTALS</h4>

                    <div className="d-flex align-items-center mb-3">
                      <span>Subtotal</span>
                      <span className="ms-auto text-red fw-bold">
                        {cartData
                          .reduce((sum, item) => sum + item.subTotal, 0)
                          .toFixed(2)}{" "}
                        ฿
                      </span>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span>Shipping</span>
                      <span className="ms-auto">
                        <b>Free</b>
                      </span>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span>Estimate For</span>
                      <span className="ms-auto">
                        <b>UK</b>
                      </span>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <span>Total</span>
                      <span className="ms-auto text-red fw-bold">
                        {cartData
                          .reduce((sum, item) => sum + item.subTotal, 0)
                          .toFixed(2)}{" "}
                        ฿
                      </span>
                    </div>

                    <Link to="/checkout">
                      <Button className="btn-red btn-lg btn-big w-100">
                        <IoBagCheckOutline /> &nbsp; Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty d-flex flex-column align-items-center justify-content-center text-center py-5">
              <FaShoppingCart size={120} className="mb-3 text-muted" />
              <h3 className="mb-3">Your cart is currently empty</h3>
              <Link to="/">
                <Button className="btn-blue bg-red btn-lg btn-big btn-round">
                  <FaHome /> &nbsp; Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;