import 'swiper/css';
import 'swiper/css/navigation';
import { useTheme } from '@mui/material/styles';
import HomeBanner from "../../Components/HomeBanner/index";
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import { CircularProgress, useMediaQuery, Tabs, Tab, Button } from '@mui/material';
import { IoMailOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useEffect, useState, useContext } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const Home = () => {

    const context = useContext(MyContext);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
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
            const currentCat = context.categoryData.find(cat => cat.name === 'Growing Chillies');
            if (currentCat) {
                setSelectedCat(currentCat._id);
            }
        }

        fetchDataFromApi(`/api/products/featured`).then((res) => {
            setFeaturedProducts(res);
        });

        fetchDataFromApi(`/api/products?perPage=16`).then((res) => { // /api/products?perPage=8
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
                        <div className="col-12 col-md-3 mb-3 mb-md-0">
                            <div className="sticky">
                                <div className="banner">
                                    {/* <img src="https://i.redd.it/official-shorekeeper-wallpapers-v0-rl7hchtuaosd1.jpg?width=2160&format=pjpg&auto=webp&s=9369c8dcd9f1f9853debe9682c4c3a09a8935ef7"
                                    className="cursor" alt=''></img> */}
                                    <img src="https://i.pinimg.com/736x/3c/07/cb/3c07cb03a68c78e6c8bea549218e509c.jpg" className="cursor" alt=''></img>
                                </div>
                                <div className="banner mt-3">
                                    {/* <img src="https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/character/%25E8%2583%25A1%25E6%25A1%2583/avatar_header.jpg" className="cursor" alt=''></img> */}
                                    <img src="https://cdn.vectorstock.com/i/1000v/57/03/fiery-chili-pepper-hot-sauce-poster-vector-21825703.jpg" className="cursor" alt=''></img>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-9 productRow">
                            {/* POPULAR PRODUCTS */}
                            <div className="d-flex align-items-center mb-3" style={{ gap: 8, flexWrap: 'wrap' }}>
                                <div className={`info ${isSmallScreen ? 'w-100' : 'w-75'}`}>
                                    <h3 className="mb-0 hd">POPULAR PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of March.</p>
                                </div>
                                <div className={`${isSmallScreen ? 'w-100' : ''}`}>
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
                            </div>
                            <div className="product_row w-100 ms-0 mt-3 mb-3">
                                {isLoading ? (
                                    <div className="d-flex justify-content-center w-100">
                                        <CircularProgress size={30} />
                                    </div>
                                ) : (
                                    <Swiper
                                        slidesPerView={4}
                                        spaceBetween={10}
                                        slidesPerGroup={3}
                                        breakpoints={{
                                            0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 10 },
                                            576: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 10 },
                                            768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 10 },
                                            992: { slidesPerView: 4, slidesPerGroup: 3, spaceBetween: 10 }
                                        }}
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
                            <div className='d-flex mt-3 mb-3 bannerSec'>
                                <div className='banner'>
                                    {/* <img src="https://upload-os-bbs.hoyolab.com/upload/2025/02/19/17138284/27ba89c413438ab2ebf9dbe2ba2f4a1b_4605514812593865506.jpeg?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70"
                                    alt='' className='cursor w-100' /> */}
                                    <img src="https://img.freepik.com/premium-vector/hot-sauce-ads-with-chilli-burning-fire-effect-3d-illustration_317442-1468.jpg"
                                        alt='' className='cursor w-100' />
                                </div>
                                <div className='banner'>
                                    {/* <img src="https://preview.redd.it/wuthering-waves-2-4-official-art-v0-qe8eaxiwgh3f1.jpeg?width=1659&format=pjpg&auto=webp&s=8f392ed3c953037debf495659bc227be23930b95"
                                    alt='' className='cursor w-100' /> */}
                                    <img src="https://img.freepik.com/premium-vector/hot-sauce-horizontal-banner-template_98292-9543.jpg"
                                        alt='' className='cursor w-100' />
                                </div>
                                <div className='banner'>
                                    {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF3WG7oxTsCW5tGlih5uay4ao6kOgSGIQIqg&s" alt='' className='cursor w-100' /> */}
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjZBY8qA4XTvJAJF21cMd2W_5OAWDqKRAYANRsdKmKo5GaPZi3cI8m1SN2xgfx8ZtF0jA&usqp=CAU" alt='' className='cursor w-100' />
                                </div>
                            </div>
                            {/* NEW PRODUCTS */}
                            <div className="d-flex align-items-center mt-4">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>
                            </div>
                            <div className="product_row productRow2 w-100 mt-4 d-flex ms-0">
                                {
                                    productsData?.products?.length !== 0 && productsData?.products?.map((item, index) => {
                                        return (
                                            <ProductItem key={index} item={item} />
                                        )
                                    })
                                }
                            </div>
                            <div className="d-flex bannerSec">
                                <div className="banner mt-3">
                                    <img src="https://img.freepik.com/free-vector/pepper-cooking-realistic-composition_1284-71901.jpg?semt=ais_hybrid&w=740&q=80"
                                        className="cursor w-100" alt='' />
                                </div>
                                <div className="banner mt-3">
                                    <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/chili-fast-food-design-template-04ef514df0c66d174d294fd0bb9ed58c_screen.jpg?ts=1600257113"
                                        className="cursor w-100" alt='' />
                                </div>
                                <div className="banner mt-3">
                                    <img src="https://www.shutterstock.com/image-vector/red-chili-pepper-on-fire-600nw-2226962111.jpg"
                                        className="cursor w-100" alt='' />
                                </div>
                            </div>
                            {/* BANNER */}
                        </div>
                        {/* ORGANIC PRODUCTS */}
                        <div className="d-flex align-items-center mt-4 mb-0">
                            <div className="info w-75">
                                <h3 className="mb-0 hd">ORGANIC PRODUCTS</h3>
                                <p className="text-light text-sml mb-0">Do not miss the current offers until the end of March.</p>
                            </div>
                        </div>
                        <div className="product_row w-100 mt-2">
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={10}
                                slidesPerGroup={3}
                                breakpoints={{
                                    0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 10 },
                                    576: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 10 },
                                    768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 10 },
                                    992: { slidesPerView: 4, slidesPerGroup: 3, spaceBetween: 10 }
                                }}
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
                        <div className="d-flex bannerSec">
                            <div className="banner mt-3">
                                <img src="https://png.pngtree.com/thumb_back/fh260/background/20230519/pngtree-red-chilli-powder-in-a-wooden-bowl-image_2572459.jpg"
                                    className="cursor w-100" alt='' />
                            </div>
                            <div className="banner mt-3">
                                <img src="https://readfieldmeats.com/wp-content/uploads/2016/01/banner-texas-style-chili.jpg"
                                    className="cursor w-100" alt='' />
                            </div>
                            <div className="banner mt-3">
                                <img src="https://5.imimg.com/data5/ANDROID/Default/2024/1/378418449/GQ/SN/UL/19256287/product-jpeg.jpg"
                                    className="cursor w-100" alt='' />
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            {/* newsLetter */}
            <section className="newsLetterSection mt-3 d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <p className="text-white mb-1">$20 discount for your first order</p>
                            <h3 className="text-white">Join our newsletter and get...</h3>
                            <p className="text-white" style={{ fontSize: '16px' }}>
                                Join our email subscription now to get
                                updates on <br /> promotions and coupons.</p>
                            <form>
                                <IoMailOutline />
                                <input type="text" placeholder="Your email address" />
                                <Button className='btn-red btn-lg btn-big'>Subscription</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}

export default Home;