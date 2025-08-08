import { CircularProgress, Rating } from "@mui/material";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { BsCartFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import Tooltip from "@mui/material/Tooltip";
import RelatedProducts from "../../Pages/ProductDetails/RelatedProducts";
import ProductZoom from "../../Components/ProductZoom";
//import QuantityBox from "../../Components/QuantityDrop";
import Button from '@mui/material/Button';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import Alert from '@mui/material/Alert';

dayjs.extend(utc)
dayjs.extend(timezone)

const ProductDetails = () => {

    const [activeSpicy, setActiveSpicy] = useState(null);
    const [activeWeight, setActiveWeight] = useState(null);
    const [activeContent, setActiveContent] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    let [cartFields] = useState({});
    const [quantityVal] = useState(1); //const [quantityVal, setQuantityVal] = useState(1);
    const [productData, setProductData] = useState();
    const [relatedProductData, setRelatedProductData] = useState([]);
    const [recentlyViewProducts, setRecentlyViewProducts] = useState([]);
    //const handleSelectedItem = (item, quantity) => { setQuantityVal(quantity);};
    const [reviewsData, setReviewsData] = useState([]);
    const [isAddedtoMyList, setAddedToMyList] = useState(false);
    const context = useContext(MyContext);

    const { id } = useParams();
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res);
            postData(`/api/products/recentlyViewed`, res)
            fetchDataFromApi(`/api/products?subCatId=${res?.subCatId}`).then((res => {
                const filteredData = res?.products?.filter(item => item.id !== id);
                setRelatedProductData(filteredData);
            }))
            fetchDataFromApi(`/api/products/recentlyViewed`).then((response) => {
                setRecentlyViewProducts(response)
            })
            postData(`/api/products/recentlyViewed`, res)
        })
        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setReviewsData(res);
        })
    }, [id])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && productData?.id) {
            postData('/api/my-list/check', {
                productId: productData?.id,
                userId: user.userId
            }).then(res => {
                if (res.status && res.isAdded) {
                    setAddedToMyList(true);
                }
            });
        }
    }, [productData?.id]);

    const isAddToCartDisabled = (
        (productData?.productSize?.length > 0 && activeSpicy === null) ||
        (productData?.productWeight?.length > 0 && activeWeight === null) ||
        (productData?.productRams?.length > 0 && activeContent === null)
    );

    const addToCart = (data) => {
        const user = JSON.parse(localStorage.getItem("user"));
        cartFields.productTitle = productData?.name
        cartFields.images = productData?.images[0]
        cartFields.rating = productData?.rating
        cartFields.price = productData?.price
        cartFields.quantity = quantityVal
        cartFields.subTotal = parseInt(productData?.price * quantityVal)
        cartFields.productId = productData?.id
        cartFields.userId = user?.userId
        context.addToCart(cartFields);
        context.getCartData();
    }

    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState({
        productId: '',
        customerName: '',
        customerId: '',
        review: '',
        customerRating: 0
    });

    const onChangeInput = (e) => {
        setReviews(() => ({
            ...reviews,
            [e.target.name]: e.target.value
        }))
    }

    const changeRating = (event, newValue) => {
        setRating(newValue);
        setReviews((prev) => ({
            ...prev,
            customerRating: newValue
        }));
    }

    const addReview = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        reviews.customerName = user?.name;
        reviews.customerId = user?.userId;
        reviews.productId = id;
        setIsLoading(true);
        postData("/api/productReviews/add", reviews).then((res) => {
            setIsLoading(false);
            reviews.customerRating = 1;
            setReviews({
                review: '',
                customerRating: 1
            })
            fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
                setReviewsData(res);
            })
        })
    }

    const addToMyList = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== '') {
            const data = {
                productTitle: productData?.name,
                images: productData?.images[0],
                rating: productData?.rating,
                price: productData?.price,
                productId: id,
                userId: user?.userId
            }
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "The product added in my list"
                    })
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    })
                }
            })
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please Login to Continue"
            })
        }
    }

    return (
        <>
            <section className="productDetails section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 ps-5">
                            <ProductZoom images={productData?.images} discount={productData?.discount} />
                        </div>
                        <div className="col-md-7 ps-5 pe-5">
                            <h2 className="hd text-capitalize">{productData?.name}</h2>
                            <ul className="list list-inline d-flex align-items-center">
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <span className="text-light me-2">Brands : </span>
                                        <span>{productData?.brand}</span>
                                    </div>
                                </li>
                                <li className="list-inline-item d-flex align-items-center">
                                    <div className="d-flex align-items-center">
                                        <Rating name="read-only" value={parseInt(productData?.rating)} readOnly size="small" />
                                        <span className="text-light cursor ms-2">{reviewsData.length} Review</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="d-flex info mb-3">
                                <span className="oldPrice">{productData?.oldPrice}฿</span>
                                <span className="newPrice text-danger ms-2">{productData?.price}฿</span>
                            </div>
                            <span className="badge bg-success">IN STOCK</span>
                            <p className="mt-2">{productData?.description}</p>
                            {
                                productData?.productSize?.length > 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Spicy Level :</span>
                                    <ul className="list list-inline mb-0 ps-4">
                                        {
                                            productData.productSize.map((item, index) => (
                                                <li key={item._id} className="list-inline-item">
                                                    <Button
                                                        className={`btn-big ${activeSpicy === index ? 'active' : ''}`}
                                                        onClick={() => setActiveSpicy(index)}
                                                    >
                                                        {item.productSize}
                                                    </Button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }

                            {
                                productData?.productWeight?.length > 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Weight :</span>
                                    <ul className="list list-inline mb-0 ps-4">
                                        {
                                            productData.productWeight.map((item, index) => (
                                                <li key={item._id} className="list-inline-item">
                                                    <Button
                                                        className={`btn-big ${activeWeight === index ? 'active' : ''}`}
                                                        onClick={() => setActiveWeight(index)}
                                                    >
                                                        {item.productWeight}
                                                    </Button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }

                            {
                                productData?.productRams?.length > 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Content :</span>
                                    <ul className="list list-inline mb-0 ps-4">
                                        {
                                            productData.productRams.map((item, index) => (
                                                <li key={item._id} className="list-inline-item">
                                                    <Button
                                                        className={`btn-big ${activeContent === index ? 'active' : ''}`}
                                                        onClick={() => setActiveContent(index)}
                                                    >
                                                        {item.productRams}
                                                    </Button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                            <div className="d-flex align-items-center mt-4">
                                { /* <QuantityBox item={productData} onQuantityChange={handleSelectedItem}/> */}
                                <Button
                                    className={`btn-red btn-lg btn-big btn-round text-white ${isAddToCartDisabled ? 'btn-danger' : 'btn-blue'}`}
                                    onClick={() => !isAddToCartDisabled && addToCart()}
                                    disabled={isAddToCartDisabled}
                                >
                                    <BsCartFill /> &nbsp;
                                    {context.addingInCart ? "adding..." : "Add to Cart"}
                                </Button>
                                <Tooltip title={`${isAddedtoMyList ? 'Added to Wishlist' : 'Add to Wishlist'}`} placement="top">
                                    <Button
                                        className="btn-blue btn-lg btn-big btn-circle ms-4"
                                        onClick={() => addToMyList(id)}
                                    >
                                        {
                                            isAddedtoMyList
                                                ? <FaHeart className="text-danger" />
                                                : <FaRegHeart />
                                        }
                                    </Button>
                                </Tooltip>
                            </div>
                            {isAddToCartDisabled && (
                                <Alert severity="error" className="mt-4">
                                    Please select: Spicy level, Weight, and Content before adding to cart.
                                </Alert>
                            )}
                        </div>
                    </div>
                    <br />
                    <div className="card mt-5 p-5 detailsPageTabs">
                        <div className="customTabs">
                            <ul className="list list-inline">
                                <li className="list-inline-item">
                                    <Button className={`btn-big ${activeTabs === 0 && 'active'}`}
                                        onClick={() => {
                                            setActiveTabs(0)
                                        }}>Description</Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button className={`btn-big ${activeTabs === 1 && 'active'}`}
                                        onClick={() => {
                                            setActiveTabs(1)
                                        }}>Additional Info</Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button className={`btn-big ${activeTabs === 2 && 'active'}`}
                                        onClick={() => {
                                            setActiveTabs(2)
                                        }}>Review ({reviewsData.length})</Button>
                                </li>
                            </ul>
                            <br />

                            {
                                activeTabs === 0 &&
                                <div className="tabContent">
                                    <p>{productData?.description}</p>
                                </div>
                            }
                            {
                                activeTabs === 1 &&
                                <div className="tabContent">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr className="stand-up">
                                                <th>Stand up</th>
                                                <td>
                                                    <p>35"L x 24"W x 37-45"H
                                                        (front to back wheel)</p>
                                                </td>
                                            </tr>
                                            <tr className="folded-wo-wheels">
                                                <th>Folded (w/0 wheels)</th>
                                                <td>
                                                    <p>32.5"L x 18.5"W x 16.5"H</p>
                                                </td>
                                            </tr>
                                            <tr className="folded-w-wheels">
                                                <th>Folded (w/ wheels)</th>
                                                <td>
                                                    <p>32.5"L x 24"W x 18.5"H</p>
                                                </td>
                                            </tr>
                                            <tr className="door-pass-through">
                                                <th>Door Pass Through</th>
                                                <td>
                                                    <p>24</p>
                                                </td>
                                            </tr>
                                            <tr className="frame">
                                                <th>Frame</th>
                                                <td>
                                                    <p>Aluminum</p>
                                                </td>
                                            </tr>
                                            <tr className="weight-wo-wheels">
                                                <th>Weight (w/o wheels)</th>
                                                <td>
                                                    <p>20 LBS</p>
                                                </td>
                                            </tr>
                                            <tr className="weight-capacity">
                                                <th>Weight Capacity</th>
                                                <td>
                                                    <p>60 LBS</p>
                                                </td>
                                            </tr>
                                            <tr className="width">
                                                <th>Width</th>
                                                <td>
                                                    <p>24"</p>
                                                </td>
                                            </tr>
                                            <tr className="handle-height-ground-to-handle">
                                                <th>Handle height (ground to handle)</th>
                                                <td>
                                                    <p>37-45"</p>
                                                </td>
                                            </tr>
                                            <tr className="wheels">
                                                <th>Wheels</th>
                                                <td>
                                                    <p>12" air / wide track slick tread</p>
                                                </td>
                                            </tr>
                                            <tr className="seat-back-height">
                                                <th>Seat back height</th>
                                                <td>
                                                    <p>21.5"</p>
                                                </td>
                                            </tr>
                                            <tr className="head-room-inside-canopy">
                                                <th>Head room (inside canopy)</th>
                                                <td>
                                                    <p>25"</p>
                                                </td>
                                            </tr>
                                            <tr className="pa_color">
                                                <th>Color</th>
                                                <td>
                                                    <p>Black, Blue, Red, White</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            }
                            {
                                activeTabs === 2 &&
                                <>
                                    <h3>Customer Questions & Answers</h3>
                                    <div className="reviewsList">
                                        {reviewsData.length ? (
                                            reviewsData.map((item, i) => (
                                                <div className="card p-3 mb-3 shadow-sm" key={i}>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h5>{item.customerName}</h5>
                                                        <small className="text-muted">{dayjs(item.dateCreated).tz('Asia/Bangkok').format('DD/MM/YY HH:mm')}</small>
                                                    </div>
                                                    <Rating name="read-only" value={item.customerRating} readOnly size="small" />
                                                    <p className="mt-2">{item.review}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No reviews yet.</p>
                                        )}

                                        <form className="reviewForm" onSubmit={addReview}>
                                            <h4>Add a review</h4>
                                            <div className="form-group">
                                                <textarea
                                                    className="form-control mb-3"
                                                    placeholder="Write a Review"
                                                    name="review"
                                                    value={reviews.review}
                                                    onChange={onChangeInput}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-center gap-3 mb-3">
                                                        <Rating name="rating" value={rating} size="medium" onChange={changeRating} />
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="form-group">
                                                <Button type="submit" className="btn-blue btn-lg btn-big btn-round">
                                                    {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Review'}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <br />
                    {
                        relatedProductData?.length !== 0 && <RelatedProducts
                            title="RELATED PRODUCTS"
                            data={relatedProductData} />
                    }
                    {
                        recentlyViewProducts?.length !== 0 && <RelatedProducts
                            title="RECENTLY VIEWED PRODUCTS"
                            itemView={"recentlyView"}
                            data={recentlyViewProducts} />
                    }
                </div>
            </section >
        </>
    )
}

export default ProductDetails;