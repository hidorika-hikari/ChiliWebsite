import 'range-slider-input/dist/style.css';
import Slider from '@mui/material/Slider';
import ProductItem from "../../Components/ProductItem";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { Rating, FormControlLabel, RadioGroup, Radio  } from "@mui/material";
import { fetchDataFromApi } from "../../utils/api";

const Sidebar = (props) => {
    const [value, setValue] = useState([1, 10000]);
    const { id } = useParams();
    const context = useContext(MyContext);

    const [filterSubCat, setFilterSubCat] = useState(null);
    const [subCatId, setSubCatId] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setSubCatId(id);
        setLoading(true);
        setError(null);

        fetchDataFromApi(`/api/products/featured`)
            .then((res) => {
                setFeaturedProducts(res);
                if (!res || res.length === 0) {
                    setError("No products found matching your filter.");
                }
            })
            .catch(() => {
                setError("Failed to load products. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (event) => {
        const selectedId = event.target.value;
        setFilterSubCat(selectedId);
        setSubCatId(selectedId);
        if (selectedId) {
            props.filterData(selectedId);
        }
    };

    const filterByRating = (rating) => {
        props.filterByRating(rating);
    };

    useEffect(() => {
        const filterId = subCatId || id;
        if (filterId) {
            props.filterByPrice(value, filterId);
        }
    }, [value, subCatId, id]);

    return (
        <div className="sidebar">
            {/* SUBCATEGORY */}
            <div className="filterBox">
                <h6>PRODUCT SUBCATEGORIES</h6>
                <div className="scroll">
                    <RadioGroup
                        name="controlled-radio-buttons-group"
                        value={filterSubCat}
                        onChange={handleChange}
                    >
                        {context.subCategoryData?.map((item) => (
                            <FormControlLabel
                                key={item?.id}
                                value={item?.id}
                                control={<Radio />}
                                label={item?.subCat}
                            />
                        ))}
                    </RadioGroup>
                </div>
            </div>

            {/* PRICE FILTER */}
            <div className="filterBox">
                <h6>FILTER BY PRICE</h6>
                <Slider
                    value={value}
                    onChange={(e, newValue) => setValue(newValue)}
                    valueLabelDisplay="auto"
                    min={1}
                    max={10000}
                    step={5}
                />
                <div className="d-flex justify-content-between mt-2">
                    <span>From: <strong className="text-success">{value[0]}฿</strong></span>
                    <span>To: <strong className="text-success">{value[1]}฿</strong></span>
                </div>
            </div>

            {/* RATING FILTER */}
            <div className="filterBox">
                <h6>FILTER BY RATING</h6>
                <div className="scroll ps-0">
                    <ul style={{ paddingLeft: 0 }}>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <li key={rating} onClick={() => filterByRating(rating)}>
                                <Rating name="read-only" value={rating} readOnly size="small" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* FEATURED PRODUCTS */}
            <div className="w-100 res-hide">
                <h6 className="mb-0 hd">FEATURED PRODUCTS</h6>

                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : featuredProducts?.length > 0 ? (
                    <Swiper
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        modules={[Navigation, Autoplay]}
                        className="mySwiper"
                    >
                        {featuredProducts.map((item, index) => (
                            <SwiperSlide key={index}>
                                <ProductItem item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p>No products found.</p>
                )}
            </div>

            {/* BANNER */}
            <Link to="#">
                <img
                    src="https://cdn.vectorstock.com/i/1000v/28/66/chili-pepper-chalk-hand-drawn-banner-template-vector-33882866.jpg" 
                    className="w-100"
                    alt="banner"
                />
            </Link>
        </div>
    );
};

export default Sidebar;