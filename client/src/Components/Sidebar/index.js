import FormControlLabel from "@mui/material/FormControlLabel";
import 'range-slider-input/dist/style.css';
import Slider from '@mui/material/Slider';
import ProductItem from "../../Components/ProductItem";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { Rating } from "@mui/material";
import { fetchDataFromApi } from "../../utils/api";

const Sidebar = (props) => {
    const [value, setValue] = useState([1, 10000]);

    const { id } = useParams();
    const context = useContext(MyContext);

    const [filterSubCat, setFilterSubCat] = useState(null);
    const [subCatId, setSubCatId] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        setSubCatId(id)
        fetchDataFromApi(`/api/products/featured`).then((res) => {
            setFeaturedProducts(res);
        });
    }, [id])

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
    }

    useEffect(() => {
        const filterId = subCatId || id;
        if (filterId) {
            props.filterByPrice(value, filterId);
        }
    }, [value, subCatId, id]);

    return (
        <>
            <div className="sidebar">
                <div className="filterBox">
                    <h6>PRODUCT SUBCATEGORIES</h6>
                    <div className="scroll">
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={filterSubCat}
                            onChange={handleChange}
                        >
                            {context.subCategoryData?.map((item, index) => (
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
                <br />
                <div className="filterBox">
                    <h6>FILTER BY RATING</h6>
                    <div className="scroll ps-0">
                        <ul style={{ paddingLeft: 0 }}>
                            <li onClick={() => filterByRating(5)}><Rating name="read-only" value={5} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(4)}><Rating name="read-only" value={4} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(3)}><Rating name="read-only" value={3} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(2)}><Rating name="read-only" value={2} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(1)}><Rating name="read-only" value={1} readOnly size="small" /></li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div className="w-100 res-hide">
                        <h6 className="mb-0 hd">FEATURED PRODUCTS</h6>
                        <Swiper
                            pagination={{
                                clickable: true,
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            modules={[Navigation, Autoplay]}
                            className="mySwiper"
                        >
                            {
                                featuredProducts?.length !== 0 && featuredProducts?.map((item, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <ProductItem item={item} />
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                </div>
                {/* <Link to="#"><img src="https://upload-os-bbs.hoyolab.com/upload/2023/03/01/70666504/86c82c999ffab3f3705e45212a45f18d_955076272047390176.jpg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" className="w-100" alt="" /></Link> */}
                <Link to="#"><img src="https://cdn.vectorstock.com/i/1000v/28/66/chili-pepper-chalk-hand-drawn-banner-template-vector-33882866.jpg" className="w-100" alt="" /></Link>
            </div>
        </>
    );
};

export default Sidebar;