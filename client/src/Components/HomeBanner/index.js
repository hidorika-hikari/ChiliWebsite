import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomeBanner = (props) => {
    return (
        <div className="container mt-3">
            <div className="homeBannerSection">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={15}
                    breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 8 },
                        576: { slidesPerView: 1, spaceBetween: 10 },
                        768: { slidesPerView: 1, spaceBetween: 12 },
                        992: { slidesPerView: 1, spaceBetween: 15 }
                    }}
                    navigation={true}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Autoplay]}
                    className="mySwiper"
                >
                    {
                        props?.data?.length !== 0 && props?.data?.map((item, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <img
                                        src={item?.images[0]}
                                        alt={`Slide ${index}`}
                                        className="w-100"
                                        style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
                                    />
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    );
};

export default HomeBanner;