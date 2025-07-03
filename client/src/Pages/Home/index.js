import 'swiper/css';
import 'swiper/css/navigation';
import HomeBanner from "../../Components/HomeBanner/index";
import Button from '@mui/material/Button'
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import newsLetterImg from '../../assets/coupons.png'
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';

const Home = () => {

    const [catData, setCatData] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [productsData, setProductsData] = useState([]);

    useEffect(() => {
        fetchDataFromApi("/api/category").then((res) => {
            setCatData(res);
        })
        fetchDataFromApi(`/api/products/featured`).then((res) => {
            setFeaturedProducts(res);
        })
        fetchDataFromApi(`/api/products/`).then((res) => {
            console.log(res);
            setProductsData(res);
        })
    }, []);

    return (
        <>
            <HomeBanner />
            {
                catData.length !== 0 && (
                    <HomeCat catData={catData} />
                )
            }

            <section className="homeProducts">
                <div className="container">
                    <div className="row">
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
                                                    <ProductItem item={item}/>
                                                </SwiperSlide>
                                            )
                                        })
                                    }
                                </Swiper>
                            </div>

                            <div className="d-flex align-items-center mt-4">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>

                                <Button className="viewAllBtn ms-auto">View All<IoIosArrowRoundForward /></Button>
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
                            <img src={newsLetterImg} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;