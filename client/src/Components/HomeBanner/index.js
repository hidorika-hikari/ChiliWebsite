import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomeBanner = () => {
    const images = [
        "https://brandsitesplatform-res.cloudinary.com/image/fetch/w_auto:100,c_scale,q_auto:eco,f_auto,fl_lossy,dpr_auto,e_sharpen:85/https://assets.brandplatform.generalmills.com%2F-%2Fmedia%2Fproject%2Fgmi%2Foldelpaso%2Foldelpaso-uk%2Foepp%2Farticles%2Fold-el-paso-mexican-tacos-1400x580-banner-uk.png%3Frev%3D2d7ead0583f340af9d66272c39170307",
        "https://brandsitesplatform-res.cloudinary.com/image/fetch/w_auto:100,c_scale,q_auto:eco,f_auto,fl_lossy,dpr_auto,e_sharpen:85/https://assets.brandplatform.generalmills.com%2F-%2Fmedia%2Fproject%2Fgmi%2Foldelpaso%2Foldelpaso-uk%2Foepp%2Farticles%2Fold-el-paso-mexican-tacos-1400x580-banner-uk.png%3Frev%3D2d7ead0583f340af9d66272c39170307",
        "https://brandsitesplatform-res.cloudinary.com/image/fetch/w_auto:100,c_scale,q_auto:eco,f_auto,fl_lossy,dpr_auto,e_sharpen:85/https://assets.brandplatform.generalmills.com%2F-%2Fmedia%2Fproject%2Fgmi%2Foldelpaso%2Foldelpaso-uk%2Foepp%2Farticles%2Fold-el-paso-chili-con-carne-1400x580-article-banner-uk.png%3Frev%3Dbe8104bc03524f61b736a8b40d173f64",
    ];

    return (
        <div className="container mt-3">
            <div className="homeBannerSection">
        <Swiper
            slidesPerView={1}
            spaceBetween={15}
            navigation={true}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[Navigation, Autoplay]}
            className="mySwiper"
        >
            {images.map((src, index) => (
            <SwiperSlide key={index}>
                <img src={src} alt={`Slide ${index}`} className="w-100" />
            </SwiperSlide>
            ))}
        </Swiper>
            </div>
        </div>
    );
};

export default HomeBanner;