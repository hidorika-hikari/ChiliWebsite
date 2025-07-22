import { Rating } from "@mui/material";
import { FaRegHeart } from "react-icons/fa";
import { BsCartFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import RelatedProducts from "../../Pages/ProductDetails/RelatedProducts";
import ProductZoom from "../../Components/ProductZoom";
import QuantityBox from "../../Components/QuantityDrop";
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

const ProductDetails = () => {

    const [activeSpicy, setActiveSpicy] = useState(null);
    const [activeWeight, setActiveWeight] = useState(null);
    const [activeContent, setActiveContent] = useState(null);

    const [activeTabs, setActiveTabs] = useState(0);
    const [productData, setProductData] = useState();
    const [relatedProductData, setRelatedProductData] = useState([]);
    const [recentlyViewProducts, setRecentlyViewProducts] = useState([]);

    const context = useContext(MyContext);

    const { id } = useParams();
    console.log('Rating:', productData?.rating);
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
    }, [id])
    const addToCart = (id) => {
        context.addToCart(id);
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
                            <h2 className="hd text-capitalize">
                                {productData?.name}</h2>
                            <ul className="list list-inline d-flex align-items-center">
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <span className="text-light me-2">Brands : </span>
                                        <span>{productData?.brand}</span>
                                    </div>
                                </li>
                                <li className="list-inline-item d-flex align-items-center">
                                    <div className="d-flex align-items-center">
                                        <Rating name="read-only" value={parseInt(productData?.rating)} precision={0.5} readOnly size="small" />
                                        <span className="text-light cursor ms-2">1 Review</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="d-flex info mb-3">
                                <span className="oldPrice">{productData?.oldPrice}฿</span>
                                <span className="newPrice text-danger ms-2">{productData?.price}฿</span>
                            </div>
                            <span className="badge badge-success">IN STOCK</span>
                            <p className="mt-2">{productData?.description}
                            </p>
                            {
                                productData?.productSize?.length > 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Spicy Level :</span>
                                    <ul className="list list-inline mb-0 ps-4">
                                        {
                                            productData.productSize.map((item, index) => (
                                                <li key={item._id} className="list-inline-item">
                                                    <a
                                                        className={`tag ${activeSpicy === index ? 'active' : ''}`}
                                                        onClick={() => setActiveSpicy(index)}
                                                    >
                                                        {item.productSize}
                                                    </a>
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
                                                    <a
                                                        className={`tag ${activeWeight === index ? 'active' : ''}`}
                                                        onClick={() => setActiveWeight(index)}
                                                    >
                                                        {item.productWeight}
                                                    </a>
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
                                                    <a
                                                        className={`tag ${activeContent === index ? 'active' : ''}`}
                                                        onClick={() => setActiveContent(index)}
                                                    >
                                                        {item.productRams}
                                                    </a>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                            <div className="d-flex align-items-center mt-4">
                                <QuantityBox />
                                <Button className="btn-blue btn-lg btn-big btn-round" onClick={() => addToCart(id)}>
                                    <BsCartFill /> &nbsp; Add to Cart</Button>
                                <Button className="btn-blue btn-lg btn-big btn-circle ms-4">
                                    <BsCartFill /></Button>
                                <Tooltip title="Add to Wishlist" placement="top">
                                    <Button className="btn-blue btn-lg btn-big btn-circle ms-4">
                                        <FaRegHeart /></Button></Tooltip>
                                <Tooltip title="Add to Compare" placement="top">
                                    <Button className="btn-blue btn-lg btn-big btn-circle ms-4">
                                        <MdOutlineCompareArrows /></Button></Tooltip>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="card mt-5 p-5 detailsPageTabs">
                        <div className="customTabs">
                            <ul className="list list-inline">
                                <li className="list-inline-item">
                                    <Button className={`tag ${activeTabs === 0 && 'active'}`}
                                        onClick={() => {
                                            setActiveTabs(0)
                                        }}>Description</Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button className={`tag ${activeTabs === 1 && 'active'}`}
                                        onClick={() => {
                                            setActiveTabs(1)
                                        }}>Additional Info</Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button className={`tag ${activeTabs === 2 && 'active'}`}
                                        onClick={() => {
                                            setActiveTabs(2)
                                        }}>Review(3)</Button>
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
                                <div className="tabContents">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h3>Customer Question & Answers</h3>
                                            <br />
                                            <div className="card p-4 reviewsCard flex-row">
                                                <div className="reviewCard">
                                                    <div className="rounded-circle">
                                                        <img src="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3" alt="" />
                                                    </div>
                                                    <span className="text-g d-block text-center fw-bold">
                                                        Rinku Verma</span>
                                                </div>
                                                <div className="info ps-5">
                                                    <div className="d-flex align-items-center w-100 gap-3">
                                                        <h5 className="text-light">01/03/1993</h5>
                                                        <div className="ms-auto mb-1">
                                                            { /* <Rating name="half-rating-read" value={4.5} precision={0.5} readOnly size="small" /> */}
                                                        </div>
                                                    </div>
                                                    <p>Review</p>
                                                </div>
                                            </div>
                                            <br className="res-hide" />
                                            <br className="res-hide" />
                                            <form className="reviewForm">
                                                <h4>Add a review</h4>
                                                <div className="form-group">
                                                    <textarea className="form-control"
                                                        placeholder="Write a Review" name="review">
                                                    </textarea>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="Name" name="userName" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mt-2">
                                                        <div className="form-group">
                                                            { /* <Rating name="half-rating-read" value={4.5} precision={0.5} readOnly size="small" /> */}
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div className="form-group">
                                                        <Button type="submit" className="btn-blue btn-lg btn-big btn-round">
                                                            Submit Review</Button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
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