import { CircularProgress, Rating, Button, Tooltip, Alert } from "@mui/material";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { BsCartFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import RelatedProducts from "../../Pages/ProductDetails/RelatedProducts";
import ProductZoom from "../../Components/ProductZoom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const ProductDetails = () => {
    const [activeSpicy, setActiveSpicy] = useState(null);
    const [activeWeight, setActiveWeight] = useState(null);
    const [activeContent, setActiveContent] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [productData, setProductData] = useState();
    const [relatedProductData, setRelatedProductData] = useState([]);
    const [recentlyViewProducts, setRecentlyViewProducts] = useState([]);
    const [reviewsData, setReviewsData] = useState([]);
    const [isAddedToMyList, setAddedToMyList] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState({
        productId: '',
        customerName: '',
        customerId: '',
        review: '',
        customerRating: 0
    });

    const context = useContext(MyContext);
    const { id } = useParams();
    const quantityVal = 1;

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res);

            postData(`/api/products/recentlyViewed`, res);

            fetchDataFromApi(`/api/products?subCatId=${res?.subCatId}`).then((res) => {
                const filteredData = res?.products?.filter(item => item.id !== id);
                setRelatedProductData(filteredData);
            });

            fetchDataFromApi(`/api/products/recentlyViewed`).then((response) => {
                setRecentlyViewProducts(response);
            });

            postData(`/api/products/recentlyViewed`, res);
        });

        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setReviewsData(res);
        });
    }, [id]);

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

    const addToCart = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            context.setAlertBox({ open: true, error: true, msg: "Please login to add items to cart" });
            return;
        }

        const cartFields = {
            productTitle: productData?.name,
            images: productData?.images[0],
            rating: productData?.rating,
            price: productData?.price,
            quantity: quantityVal,
            subTotal: parseInt(productData?.price * quantityVal),
            productId: productData?.id,
            userId: user?.userId,
        };

        await context.addToCart(cartFields);
        context.getCartData();
        context.setAlertBox({ open: true, error: false, msg: "Product added to cart successfully!" });
    };

    const onChangeInput = (e) => {
        setReviews(() => ({
            ...reviews,
            [e.target.name]: e.target.value
        }));
    };

    const changeRating = (event, newValue) => {
        setRating(newValue);
        setReviews((prev) => ({
            ...prev,
            customerRating: newValue
        }));
    };

    const addReview = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            context.setAlertBox({ open: true, error: true, msg: "Please login to submit a review" });
            return;
        }

        const newErrors = {};
        if (!reviews.review.trim()) newErrors.review = "Please write a review before submitting.";
        if (!rating || rating < 1) newErrors.rating = "Please select a rating.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        reviews.customerName = user?.name;
        reviews.customerId = user?.userId;
        reviews.productId = id;

        setIsLoading(true);
        postData("/api/productReviews/add", reviews)
            .then(() => {
                setIsLoading(false);
                setReviews({ review: '', customerRating: 1 });
                setRating(0);
                setErrors({});
                fetchDataFromApi(`/api/productReviews?productId=${id}`).then(setReviewsData);
                context.setAlertBox({ open: true, error: false, msg: "Thank you! Your review has been submitted." });
            })
            .catch((err) => {
                setIsLoading(false);
                console.error("Error submitting review:", err);
                context.setAlertBox({ open: true, error: true, msg: "Something went wrong. Please try again later." });
            });
    };

    const addToMyList = (productId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            context.setAlertBox({ open: true, error: true, msg: "Please login to continue" });
            return;
        }

        const data = {
            productTitle: productData?.name,
            images: productData?.images[0],
            rating: productData?.rating,
            price: productData?.price,
            productId,
            userId: user?.userId
        };

        postData(`/api/my-list/add/`, data).then((res) => {
            context.setAlertBox({
                open: true,
                error: res.status === false,
                msg: res.status !== false ? "Product added in my list" : res.msg
            });
            if (res.status !== false) setAddedToMyList(true);
        });
    };

    return (
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
                                    <span className="text-light me-2">Brands :</span>
                                    <span>{productData?.brand}</span>
                                </div>
                            </li>
                            <li className="list-inline-item d-flex align-items-center">
                                <Rating name="read-only" value={parseInt(productData?.rating)} readOnly size="small" />
                                <span className="text-light cursor ms-2">{reviewsData.length} Review</span>
                            </li>
                        </ul>

                        <div className="d-flex info mb-3">
                            <span className="oldPrice">{productData?.oldPrice}฿</span>
                            <span className="newPrice text-danger ms-2">{productData?.price}฿</span>
                        </div>

                        <span className="badge bg-success">IN STOCK</span>
                        <p className="mt-2">{productData?.description}</p>

                        {productData?.productSize?.length > 0 && (
                            <div className="productSize d-flex align-items-center">
                                <span>Spicy Level :</span>
                                <ul className="list list-inline mb-0 ps-4">
                                    {productData.productSize.map((item, index) => (
                                        <li key={item._id} className="list-inline-item">
                                            <Button className={`btn-big ${activeSpicy === index ? 'active' : ''}`} onClick={() => setActiveSpicy(index)}>
                                                {item.productSize}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {productData?.productWeight?.length > 0 && (
                            <div className="productSize d-flex align-items-center">
                                <span>Weight :</span>
                                <ul className="list list-inline mb-0 ps-4">
                                    {productData.productWeight.map((item, index) => (
                                        <li key={item._id} className="list-inline-item">
                                            <Button className={`btn-big ${activeWeight === index ? 'active' : ''}`} onClick={() => setActiveWeight(index)}>
                                                {item.productWeight}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {productData?.productRams?.length > 0 && (
                            <div className="productSize d-flex align-items-center">
                                <span>Content :</span>
                                <ul className="list list-inline mb-0 ps-4">
                                    {productData.productRams.map((item, index) => (
                                        <li key={item._id} className="list-inline-item">
                                            <Button className={`btn-big ${activeContent === index ? 'active' : ''}`} onClick={() => setActiveContent(index)}>
                                                {item.productRams}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="d-flex align-items-center mt-4">
                            <Button
                                className={`btn-red btn-lg btn-big btn-round text-white ${isAddToCartDisabled ? 'btn-danger' : 'btn-blue'}`}
                                onClick={() => !isAddToCartDisabled && addToCart()}
                                disabled={isAddToCartDisabled}
                            >
                                <BsCartFill /> &nbsp; {context.addingInCart ? "adding..." : "Add to Cart"}
                            </Button>

                            <Tooltip title={`${isAddedToMyList ? 'Added to Wishlist' : 'Add to Wishlist'}`} placement="top">
                                <Button className="btn-blue btn-lg btn-big btn-circle ms-4" onClick={() => addToMyList(id)}>
                                    {isAddedToMyList ? <FaHeart className="text-danger" /> : <FaRegHeart />}
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

                <div className="card mt-5 p-5 detailsPageTabs">
                    <div className="customTabs">
                        <ul className="list list-inline">
                            <li className="list-inline-item">
                                <Button className={`btn-big ${activeTabs === 0 && 'active'}`} onClick={() => setActiveTabs(0)}>Description</Button>
                            </li>
                            <li className="list-inline-item">
                                <Button className={`btn-big ${activeTabs === 2 && 'active'}`} onClick={() => setActiveTabs(2)}>Review ({reviewsData.length})</Button>
                            </li>
                        </ul>

                        {activeTabs === 0 && <div className="tabContent"><p>{productData?.description}</p></div>}

                        {activeTabs === 2 && (
                            <>
                                <h3>Customer Questions & Answers</h3>
                                <div className="reviewsList">
                                    {reviewsData.length ? reviewsData.map((item, i) => (
                                        <div className="card p-3 mb-3 shadow-sm" key={i}>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5>{item.customerName}</h5>
                                                <small className="text-muted">{dayjs(item.dateCreated).tz('Asia/Bangkok').format('DD/MM/YY HH:mm')}</small>
                                            </div>
                                            <Rating name="read-only" value={item.customerRating} readOnly size="small" />
                                            <p className="mt-2">{item.review}</p>
                                        </div>
                                    )) : <p>No reviews yet.</p>}

                                    <form className="reviewForm" onSubmit={addReview}>
                                        <h4>Add a review</h4>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control mb-1"
                                                placeholder="Write a Review"
                                                name="review"
                                                value={reviews.review}
                                                onChange={onChangeInput}
                                                rows={4}
                                            />
                                            {errors.review && <small className="text-danger">{errors.review}</small>}
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Rating name="rating" value={rating} size="medium" onChange={changeRating} />
                                                {errors.rating && <small className="text-danger">{errors.rating}</small>}
                                            </div>
                                        </div>
                                        <br />
                                        <Button type="submit" className="btn-blue btn-lg btn-big btn-round">
                                            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Review'}
                                        </Button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {relatedProductData?.length !== 0 && <RelatedProducts title="RELATED PRODUCTS" data={relatedProductData} />}
                {recentlyViewProducts?.length !== 0 && <RelatedProducts title="RECENTLY VIEWED PRODUCTS" itemView={"recentlyView"} data={recentlyViewProducts} />}
            </div>
        </section>
    );
};

export default ProductDetails;