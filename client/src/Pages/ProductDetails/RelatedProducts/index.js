import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductItem from "../../../Components/ProductItem";

const RelatedProducts = (props) => {
    return (
        <>
            <div className="d-flex align-items-center mt-3 mb-3">
                <div className="info w-75">
                    <h3 className="mb-0 hd">{props.title}</h3>
                </div>
            </div>

            <div className="product_row w-100 mt-0">
                <Swiper
                    slidesPerView={6}
                    spaceBetween={10}
                    slidesPerGroup={3}
                    navigation={true}
                    breakpoints={{
                        0: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                            slidesPerGroup: 1,
                        },
                        480: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                            slidesPerGroup: 1,
                        },
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 15,
                            slidesPerGroup: 1,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 15,
                            slidesPerGroup: 2,
                        },
                        992: {
                            slidesPerView: 5,
                            spaceBetween: 20,
                            slidesPerGroup: 2,
                        },
                        1200: {
                            slidesPerView: 6,
                            spaceBetween: 20,
                            slidesPerGroup: 3,
                        },
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {
                        props?.data?.length !== 0 &&
                        props?.data?.map((item, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <ProductItem
                                        item={item}
                                        itemView={props.itemView}
                                    />
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </>
    )
}

export default RelatedProducts;