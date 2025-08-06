import 'swiper/css';
import 'swiper/css/navigation';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import HomeBanner from "../../Components/HomeBanner/index";
import Button from '@mui/material/Button'
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import newsLetterImg from '../../assets/coupons.png'
import { CircularProgress } from '@mui/material';
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useEffect, useState, useContext } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const Home = () => {

    const context = useContext(MyContext);
    const [value, setValue] = useState(0);

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [filterData, setFilterData] = useState([]);

    const [homeBannerSlide, setHomeBannerSlide] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (context.categoryData?.length > 0) {
            const hutaoCat = context.categoryData.find(cat => cat.name === 'Hutao');
            if (hutaoCat) {
                setSelectedCat(hutaoCat._id);
            }
        }

        fetchDataFromApi(`/api/products/featured`).then((res) => {
            setFeaturedProducts(res);
        });

        fetchDataFromApi(`/api/products?perPage=8`).then((res) => {
            setProductsData(res);
        });

        fetchDataFromApi(`/api/homeBanner`).then((res) => {
            setHomeBannerSlide(res);
        });
    }, [context.categoryData]);

    const selectCat = (catId) => {
        setSelectedCat(catId);
    };

    useEffect(() => {
        if (!selectedCat) return;
        setIsLoading(true);
        fetchDataFromApi(`/api/products?category=${selectedCat}`).then((res) => {
            setFilterData(res.products);
            setIsLoading(false);
        });
    }, [selectedCat]);

    return (
        <>
            {
                homeBannerSlide?.length !== 0 && <HomeBanner data={homeBannerSlide} />
            }
            {
                context.categoryData?.length !== 0 && <HomeCat catData={context.categoryData} />
            }
            <section className="homeProducts">
                <div className="container">
                    <div className="row">
                        {/* SIDEBAR BANNER */}
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner">
                                    <img src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/banner-box.jpg" className="cursor" alt=''></img>
                                    {/* <img src={} className="cursor"></img> */}
                                </div>
                                <div className="banner mt-3">
                                    <img src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/banner-box.jpg" className="cursor" alt=''></img>
                                    {/* <img src={} className="cursor"></img> */}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9 productRow">
                            {/* //FEATURED PRODUCTS */}
                            <div className="d-flex align-items-center">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">FEATURED PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of March.</p>
                                </div>
                                <Button className="viewAllBtn ms-auto">View All<IoIosArrowRoundForward /></Button>
                            </div>
                            <div className="product_row w-100 mt-2">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    slidesPerGroup={3}
                                    navigation={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[Navigation]}
                                    className="mySwiper">
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
                            {/* POPULAR PRODUCTS */}
                            <div className="d-flex align-items-center mt-3">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">POPULAR PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of March.</p>
                                </div>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable tabs"
                                >
                                    {context.categoryData?.map((item, index) => (
                                        <Tab
                                            key={index}
                                            className="item"
                                            label={item.name}
                                            onClick={() => selectCat(item._id)}
                                        />
                                    ))}
                                </Tabs>
                            </div>
                            <div className="product_row w-100 mt-2">
                                {isLoading ? (
                                    <div className="d-flex justify-content-center w-100">
                                        <CircularProgress size={30} />
                                    </div>
                                ) : (
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={10}
                                        slidesPerGroup={3}
                                        navigation={true}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        modules={[Navigation]}
                                        className="mySwiper"
                                    >
                                        {filterData?.length !== 0 && filterData.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <ProductItem item={item} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                )}
                            </div>
                            {/* BANNER */}
                            <div className='d-flex mt-4 mb-5 bannerSec'>
                                <div className='banner'>
                                    <img src="https://api.spicezgold.com/download/file_1734525653108_NewProject(20).jpg" alt='' className='cursor w-100' />
                                </div>
                                <div className='banner'>
                                    <img src="https://api.spicezgold.com/download/file_1734525634299_NewProject(2).jpg" alt='' className='cursor w-100' />
                                </div>
                                <div className='banner'>
                                    <img src="https://api.spicezgold.com/download/file_1734525620831_NewProject(3).jpg" alt='' className='cursor w-100' />
                                </div>
                            </div>
                            {/* NEW PRODUCTS */}
                            <div className="d-flex align-items-center mt-4">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>
                            </div>
                            <div className="product_row productRow2 w-100 mt-4 d-flex">
                                {
                                    productsData?.products?.length !== 0 && productsData?.products?.map((item, index) => {
                                        return (
                                            <ProductItem key={index} item={item} />
                                        )
                                    })
                                }
                            </div>
                            {/* BANNER */}
                            <div className="d-flex mt-4 mb-5 bannerSec">
                                <div className="banner mt-4">
                                    <img src="https://cloudfront-eu-central-1.images.arcpublishing.com/williamreed/CA522QC2BZKZVIBSVPBDMNLML4.jpg"
                                        className="cursor w-100" alt='' />
                                </div>
                                <div className="banner mt-4">
                                    <img src="https://www.thespruceeats.com/thmb/rljsggiCQFN3WvoCebr7XHwo9a8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-930279012-e1d17f3f2e14473db877437ce57b8f5f.jpg"
                                        className="cursor w-100" alt='' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* newsLetter */}
            <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="text-white mb-1">$20 discount for your first order</p>
                            <h3 className="text-white">Join our newsletter and get...</h3>
                            <p className="text-light">Join our email subscription now to get
                                updates on <br /> promotions and coupons.</p>
                            <form>
                                <IoMailOutline />
                                <input type="text" placeholder="Your email address" />
                                <Button>Subscription</Button>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <img src={newsLetterImg} alt='' />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;