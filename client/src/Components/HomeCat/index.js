import 'swiper/css';
import 'swiper/css/navigation';
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeCat = (props) => {
    return (
        <section className="homeCat">
            <div className="container featuredCategories">
                <h3 className="mb-3 hd text-center text-md-start">
                    Featured Categories
                </h3>

                <Swiper
                    slidesPerView={10}
                    spaceBetween={12}
                    navigation={true}
                    slidesPerGroup={2}
                    breakpoints={{
                        0: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 10
                        },

                        480: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 10
                        },

                        576: {
                            slidesPerView: 4,
                            slidesPerGroup: 4,
                            spaceBetween: 12
                        },

                        768: {
                            slidesPerView: 5,
                            slidesPerGroup: 5,
                            spaceBetween: 12
                        },

                        992: {
                            slidesPerView: 7,
                            slidesPerGroup: 4,
                            spaceBetween: 14
                        },

                        1200: {
                            slidesPerView: 9,
                            slidesPerGroup: 5,
                            spaceBetween: 16
                        }
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Navigation]}
                    className="mySwiper featuredSwiper"
                >
                    {
                        props.catData?.length !== 0 &&
                        props.catData?.map((cat, index) => {
                            return (
                                <SwiperSlide key={index}>

                                    <Link
                                        to={`/products/category/${cat.id}`}
                                        className="categoryCard"
                                    >

                                        <div
                                            className="item text-center cursor categoryImage"
                                            style={{ background: cat.color }}
                                        >
                                            <img
                                                src={cat.images[0]}
                                                alt={cat.name}
                                                className='w-100 h-100 object-fit-contain'
                                            />
                                        </div>

                                        <h6
                                            className="cat-title"
                                            style={{ color: cat.color }}
                                        >
                                            {cat.name}
                                        </h6>

                                    </Link>

                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
                </div>
        </section>
    )
}

export default HomeCat;