import { Breadcrumbs, Chip, emphasize, styled } from '@mui/material';
import { FaHome, FaReply } from 'react-icons/fa';
import { FaTag } from 'react-icons/fa6';
import { MdBrandingWatermark } from 'react-icons/md';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { AiFillDollarCircle } from 'react-icons/ai';
import { IoIosColorPalette } from 'react-icons/io';
import { MdRateReview } from 'react-icons/md';
import { MdOutlineStorage } from 'react-icons/md';
import { MdOutlinePublishedWithChanges } from 'react-icons/md';
import UserAvatarImgComponent from '../../components/userAvatarImg';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import React from 'react';
import Slider from 'react-slick';

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
    var productSliderOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    var productSliderSmallOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <>
            <div className="right-content w-100">
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
                            <div className="sliderWrapper pt-3 pb-3 ps-4 pe-4">
                                <h6 className="mb-4">Product Gallery</h6>
                                <Slider
                                    {...productSliderOptions}
                                    className="sliderBig mb-2"
                                >
                                    <div className="item">
                                        <img
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp"
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                </Slider>

                                <Slider
                                    {...productSliderSmallOptions}
                                    className="sliderSml"
                                >
                                    <div className="item">
                                        <img
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/02.webp"
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                    <div className="item">
                                        <img
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/03.webp"
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                    <div className="item">
                                        <img
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/04.webp"
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                    <div className="item">
                                        <img
                                            src="https://mironcoder-hotash.netlify.app/images/product/single/05.webp"
                                            alt=""
                                            className="w-100"
                                        />
                                    </div>
                                </Slider>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className=" pt-3 pb-3 ps-4 pe-4">
                                <h6 className="mb-4">Product Details</h6>
                                <h4>
                                    Formal suits for men wedding slim fit 3
                                    piece dress business party jacket
                                </h4>

                                <div className="productInfo mt-4">
                                    <div className="row mb-2">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <MdBrandingWatermark />
                                            </span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>Ecstasy</span>
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
                                            <span>Man's</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <FaTag />
                                            </span>
                                            <span className="name">Tag</span>
                                        </div>
                                        <div className="col-sm-9">
                                            <span>
                                                <div className="row">
                                                    <ul className="list list-inline tags sml">
                                                        <li className="list-inline-item">
                                                            <span>SUITE</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>PARTY</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span>DRESS</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon">
                                                <IoIosColorPalette />
                                            </span>
                                            <span className="name">Color</span>
                                        </div>
                                        <div class="col-sm-9">
                                            <span>
                                                <div class="row">
                                                    <ul class="list list-inline tags sml">
                                                        <li class="list-inline-item">
                                                            <span>RED</span>
                                                        </li>
                                                        <li class="list-inline-item">
                                                            <span>BLUE</span>
                                                        </li>
                                                        <li class="list-inline-item">
                                                            <span>WHITE</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
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
                                            <span>(68) Piece</span>
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
                                            <span>(13) Review</span>
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
                                            <span>02 Feb 2020</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <h6 className="mb-3 mt-4">Product Description</h6>
                        <p style={{ fontWeight: 400 }}>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Molestiae reprehenderit repellendus expedita
                            esse cupiditate quos doloremque rerum, corrupti ab
                            illum est nihil, voluptate ex dignissimos! Sit
                            voluptatem delectus nam, molestiae, repellendus ab
                            sint quo aliquam debitis amet natus doloremque
                            laudantium? Repudiandae, consequuntur, officiis
                            quidem quo deleniti, autem non laudantium sequi
                            error molestiae ducimus accusamus facere velit
                            consectetur vero dolore natus nihil temporibus
                            aspernatur quia consequatur? Consequuntur voluptate
                            deserunt repellat tenetur debitis molestiae
                            doloribus dicta. In rem illum dolorem atque ratione
                            voluptates asperiores maxime doloremque laudantium
                            magni neque ad quae quos quidem, quaerat rerum
                            ducimus blanditiis reiciendis
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
                            </div>
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
