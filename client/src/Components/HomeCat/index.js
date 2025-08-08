import 'swiper/css';
import 'swiper/css/navigation';
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

const HomeCat = (props) => {
    return (
        <section className="homeCat">
            <div className="container">
                <h3 className="mb-3 hd">Featured Categories</h3>
                <Swiper
                    slidesPerView={10}
                    spaceBetween={8}
                    navigation={true}
                    slidesPerGroup={3}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {
                        props.catData?.length !== 0 && props.catData?.map((cat, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <Link to={`/products/category/${cat.id}`}>
                                        <div
                                            className="item text-center cursor"
                                            style={{ background: cat.color }}
                                        >
                                            <img src={cat.images[0]} alt='' className='w-100 h-100 mb-1' />
                                        </div>
                                        <h6
                                            className="cat-title"
                                            style={{ color: cat.color, textAlign: "center" }}
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