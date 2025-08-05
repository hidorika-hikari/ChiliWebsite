import { Breadcrumbs, Chip, emphasize, styled } from '@mui/material';
import { FaHome, FaReply } from 'react-icons/fa';
import { MdBrandingWatermark, MdContentCopy } from 'react-icons/md';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { AiFillDollarCircle } from 'react-icons/ai';
import { MdRateReview } from 'react-icons/md';
import { MdOutlineStorage } from 'react-icons/md';
import { MdOutlinePublishedWithChanges } from 'react-icons/md';
import { useParams } from "react-router-dom";
import UserAvatarImgComponent from '../../components/userAvatarImg';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { RiWeightLine } from 'react-icons/ri';
import { SlSizeFullscreen } from "react-icons/sl";
import ProductZoom from '../../../../admin/src/components/ProductZoomAdmin';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'react-inner-image-zoom/lib/styles.min.css';


dayjs.extend(utc)
dayjs.extend(timezone)

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

const ProductDetails = () => {

    const [productData, setProductData] = useState([]);
    const [reviewsData, setReviewsData] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        window.scrollTo(0,0);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res);
        })
        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setReviewsData(res);
        })
    }, []);

    return (
        <>
            <div className="right-content w-100 productDetails">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Product View</h5>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className="ms-auto breadcrumb_"
                    >
                        <StyleBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<FaHome fontSize="small" />}
                        />
                        <StyleBreadcrumb
                            label="Products"
                            component="a"
                            href="#"
                        />
                        <StyleBreadcrumb label="Product View" />
                    </Breadcrumbs>
                </div>
                <div className="card productDetailsSEction">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="sliderWrapper pt-3 pb-3 ps-4 pe-4 mt-3">
                                <ProductZoom images={productData?.images} discount={productData?.discount}/>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className=" pt-3 pb-3 ps-4 pe-4 mt-3">
                                <h4>{productData?.name}</h4>
                                <div className="productInfo mt-4">
                                    <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <MdBrandingWatermark />
                                            </span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>{productData?.brand}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <BiSolidCategoryAlt />
                                            </span>
                                            <span className="name">
                                                Category
                                            </span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>{productData?.category?.name}</span>
                                        </div>
                                    </div>
                                    {
                                        productData?.productRams?.length !== 0 && (
                                            <div className="row">
                                                <div className="col-sm-3 d-flex align-items-center">
                                                    <span className="icon"><MdContentCopy /></span>
                                                    <span className="name">Content</span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <span>
                                                            <div className="row">
                                                                <ul className="list list-inline tags sml">
                                                                    {
                                                                        productData?.productRams?.map((item, index) => {
                                                                            return (
                                                                                <li className="list-inline-item" key={index}>
                                                                                    <span>{item.productRams}</span>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        productData?.productSize?.length !== 0 && (
                                            <div className="row">
                                                <div className="col-sm-3 d-flex align-items-center">
                                                    <span className="icon"><SlSizeFullscreen /></span>
                                                    <span className="name">Size</span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <span>
                                                            <div className="row">
                                                                <ul className="list list-inline tags sml">
                                                                    {
                                                                        productData?.productSize?.map((item, index) => {
                                                                            return (
                                                                                <li className="list-inline-item" key={index}>
                                                                                    <span>{item.productSize}</span>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        productData?.productWeight?.length !== 0 && (
                                            <div className="row">
                                                <div className="col-sm-3 d-flex align-items-center">
                                                    <span className="icon"><RiWeightLine /></span>
                                                    <span className="name">Weight</span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <span>
                                                            <div className="row">
                                                                <ul className="list list-inline tags sml">
                                                                    {
                                                                        productData?.productWeight?.map((item, index) => {
                                                                            return (
                                                                                <li className="list-inline-item" key={index}>
                                                                                    <span>{item.productWeight}</span>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <AiFillDollarCircle />
                                            </span>
                                            <span className="name">Price</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>$50</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <MdOutlineStorage />
                                            </span>
                                            <span className="name">Stock</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>({productData?.countInStock}) Piece</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <MdRateReview />
                                            </span>
                                            <span className="name">Review</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>({reviewsData.length}) Review</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <MdOutlinePublishedWithChanges />
                                            </span>
                                            <span className="name">
                                                Published
                                            </span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                {productData?.dateCreated
                                                ? new Date(productData.dateCreated)
                                                    .toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false,
                                                        timeZone: 'Asia/Bangkok'
                                                    })
                                                    .replace(',', '')
                                                : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h6 className="mb-3 mt-4">Product Description</h6>
                        <p style={{ fontWeight: 400 }}>
                            {productData.description}
                        </p>

                        <br />

                        <h6 className="mt-4 mb-4">Rating Analytics</h6>
                        <div className="ratingSection">
                            <div className="ratingrow d-flex align-items-center">
                                <span className="col1">5 Star</span>
                                <div className="col2">
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: '70%' }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="col3">(22)</span>
                            </div>

                            <div className="ratingrow d-flex align-items-center">
                                <span className="col1">4 Star</span>
                                <div className="col2">
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="col3">(22)</span>
                            </div>

                            <div className="ratingrow d-flex align-items-center">
                                <span className="col1">3 Star</span>
                                <div className="col2">
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="col3">(2)</span>
                            </div>

                            <div className="ratingrow d-flex align-items-center">
                                <span className="col1">2 Star</span>
                                <div className="col2">
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: '20%' }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="col3">(2)</span>
                            </div>

                            <div className="ratingrow d-flex align-items-center">
                                <span className="col1">1 Star</span>
                                <div className="col2">
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="col3">(2)</span>
                            </div>
                        </div>

                        <br />
                        <h6 className="mt-4 mb-4">Customer Reviews</h6>
                        <div className="reviewsSection">
                            {
                                reviewsData?.length !== 0 && reviewsData?.map((review, index) => {
                                    return (
                                            <div className="reviewsRow">
                                                <div className="row">
                                                        <div className="col-sm-7 d-flex">
                                                            <div className="d-flex flex-column">
                                                                <div className="userInfo d-flex align-items-center mb-3">
                                                                    <div className="userInfo lg">
                                                                        <UserAvatarImgComponent
                                                                            img="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3"
                                                                            lg={true}
                                                                        />
                                                                    </div>

                                                                    <div className="info ps-3">
                                                                        <h6>{review?.customerName}</h6>
                                                                        <span>{dayjs(review?.dateCreated).tz('Asia/Bangkok').format('DD/MM/YY HH:mm')}</span>
                                                                    </div>
                                                                </div>
                                                                <Rating
                                                                    name="read-only"
                                                                    value={review?.customerRating}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5 d-flex align-items-center">
                                                            <div className="ms-auto">
                                                                <Button className="btn-blue btn-lg ms-auto">
                                                                    <FaReply /> &nbsp; Reply
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="mt-3">{review?.review}</p>
                                                </div>
                                            </div>
                                    )
                                })
                            }
                            
                            {/* <div className="reviewsRow reply">
                                <div className="row">
                                    <div className="col-sm-7 d-flex">
                                        <div className="d-flex flex-column">
                                            <div className="userInfo d-flex align-items-center mb-3">
                                                <div className="userInfo lg">
                                                    <UserAvatarImgComponent
                                                        img="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3"
                                                        lg={true}
                                                    />
                                                </div>

                                                <div className="info ps-3">
                                                    <h6>hidorika</h6>
                                                    <span>25 minutes ago</span>
                                                </div>
                                            </div>
                                            <Rating
                                                name="read-only"
                                                value={4.5}
                                                precision={0.5}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-5 d-flex align-items-center">
                                        <div className="ms-auto">
                                            <Button className="btn-blue btn-lg ms-auto">
                                                <FaReply /> &nbsp; Reply
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="mt-3">
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Omnis quo nostrum
                                        dolore fugiat ducimus labore debitis
                                        unde autem recusandae? Eius harum
                                        tempora quis minima, adipisci natus quod
                                        magni omnis quas.
                                    </p>
                                </div>
                            </div>
                            <div className="reviewsRow reply">
                                <div className="row">
                                    <div className="col-sm-7 d-flex">
                                        <div className="d-flex flex-column">
                                            <div className="userInfo d-flex align-items-center mb-3">
                                                <div className="userInfo lg">
                                                    <UserAvatarImgComponent
                                                        img="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3"
                                                        lg={true}
                                                    />
                                                </div>

                                                <div className="info ps-3">
                                                    <h6>hidorika</h6>
                                                    <span>25 minutes ago</span>
                                                </div>
                                            </div>
                                            <Rating
                                                name="read-only"
                                                value={4.5}
                                                precision={0.5}
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-5 d-flex align-items-center">
                                        <div className="ms-auto">
                                            <Button className="btn-blue btn-lg ms-auto">
                                                <FaReply /> &nbsp; Reply
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="mt-3">
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Omnis quo nostrum
                                        dolore fugiat ducimus labore debitis
                                        unde autem recusandae? Eius harum
                                        tempora quis minima, adipisci natus quod
                                        magni omnis quas.
                                    </p>
                                </div>
                            </div> */}
                        </div>

                        <h6 className="mt-4 mb-4">Review Reply Form</h6>
                        <form className="reviewForm">
                            <textarea placeholder="Write here..."></textarea>
                            <Button
                                variant="text"
                                color="primary"
                                className="btn-blue btn-big btn-lg w-100 mt-4"
                                fullWidth
                                type="button"
                            >
                                drop your replies
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
