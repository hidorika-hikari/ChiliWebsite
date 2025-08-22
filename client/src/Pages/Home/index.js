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
                        <div className="col-md-3">
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
                        <div className="col-md-9 productRow">
                            {/* POPULAR PRODUCTS */}
                            <div className="d-flex align-items-center mb-3">
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
                                    <img src="https://pbs.twimg.com/media/GwH6ExUaQAA64Pr?format=jpg&name=4096x4096"
                                        className="cursor w-100" alt='' />
                                </div>
                                <div className="banner mt-3">
                                    <img src="https://upload-os-bbs.hoyolab.com/upload/2024/02/08/17138284/adbec135e8e1ff907990690cbb111b1a_5240529329033004651.jpg"
                                        className="cursor w-100" alt='' />
                                </div>
                                <div className="banner mt-3">
                                    <img src="https://upload-os-bbs.hoyolab.com/upload/2021/05/22/21867498/19fb8c0ff0e27428841a05ddbfc0851d_3933469727756591456.jpg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70"
                                        className="cursor w-100" alt='' />
                                </div>
                            </div>
                            {/* BANNER */}
                        </div>
                        {/* //FEATURED PRODUCTS */}
                        <div className="d-flex align-items-center mt-4 mb-2">
                            <div className="info w-75">
                                <h3 className="mb-0 hd">FEATURED PRODUCTS</h3>
                                <p className="text-light text-sml mb-0">Do not miss the current offers until the end of March.</p>
                            </div>
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
                        <div className="d-flex bannerSec">
                            <div className="banner mt-3">
                                <img src="https://pbs.twimg.com/media/GwH6ExUaQAA64Pr?format=jpg&name=4096x4096"
                                    className="cursor w-100" alt='' />
                            </div>
                            <div className="banner mt-3">
                                <img src="https://upload-os-bbs.hoyolab.com/upload/2024/02/08/17138284/adbec135e8e1ff907990690cbb111b1a_5240529329033004651.jpg"
                                    className="cursor w-100" alt='' />
                            </div>
                            <div className="banner mt-3">
                                <img src="https://upload-os-bbs.hoyolab.com/upload/2021/05/22/21867498/19fb8c0ff0e27428841a05ddbfc0851d_3933469727756591456.jpg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70"
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
                        <div className="col-md-6">
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
                    <div className="col-md-6">
                        <img src={newsLetterImg} alt='' />
                    </div>
                </div>
            </div>
        </section >
        </>
    )
}

export default Home;