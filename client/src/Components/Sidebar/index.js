import 'range-slider-input/dist/style.css';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductItem from "../../Components/ProductItem";
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { Rating, FormControlLabel, RadioGroup, Radio, Slider } from "@mui/material";
import { fetchDataFromApi } from "../../utils/api";

// Add CSS animation for loading spinner
const spinnerStyle = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Inject the CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = spinnerStyle;
    document.head.appendChild(style);
}

const Sidebar = (props) => {
    const [value, setValue] = useState([1, 1000]);
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

    const clearSubCategoryFilter = () => {
        setFilterSubCat(null);
        setSubCatId('');
        // Reset to show all products in current category
        if (id) {
            // Show all products in current category without subcategory filter
            props.filterData(null);
        } else {
            // Show all products without any filters
            props.filterData(null);
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
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">PRODUCT SUBCATEGORIES</h6>
                    {filterSubCat && (
                        <button 
                            onClick={clearSubCategoryFilter}
                            style={{ 
                                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                                border: 'none', 
                                color: 'white', 
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                borderRadius: '12px',
                                padding: '4px 10px',
                                boxShadow: '0 2px 4px rgba(255, 107, 107, 0.3)',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(255, 107, 107, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 4px rgba(255, 107, 107, 0.3)';
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="scroll">
                    {!context.subCategoryData ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '20px 10px',
                            color: '#666'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid #007bff',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '10px'
                            }}></div>
                            <p style={{ fontSize: '14px', margin: 0 }}>Loading subcategories...</p>
                        </div>
                    ) : context.subCategoryData.length === 0 ? (
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            padding: '20px 10px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px',
                                fontSize: '24px'
                            }}>
                                📂
                            </div>
                            <p style={{ 
                                color: '#6c757d', 
                                fontSize: '14px', 
                                margin: '0 0 8px 0',
                                fontWeight: '500'
                            }}>
                                No subcategories available
                            </p>
                            <p style={{ 
                                color: '#adb5bd', 
                                fontSize: '12px', 
                                margin: 0,
                                lineHeight: '1.4'
                            }}>
                                Subcategories will appear here when available
                            </p>
                        </div>
                    ) : (
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={filterSubCat}
                            onChange={handleChange}
                            aria-label="product subcategories"
                        >
                            {context.subCategoryData.map((item) => (
                                <FormControlLabel
                                    key={item?.id}
                                    value={item?.id}
                                    control={<Radio />}
                                    label={item?.subCat}
                                />
                            ))}
                        </RadioGroup>
                    )}
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
                    max={1000}
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