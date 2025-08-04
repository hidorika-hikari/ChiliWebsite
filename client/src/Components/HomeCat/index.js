import 'swiper/css';
import 'swiper/css/navigation';
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

function getContrastTextColor(hexColor) {
    if (!hexColor) return '#000';
    hexColor = hexColor.replace('#', '');
    if (hexColor.length === 3) {
        hexColor = hexColor.split('').map(c => c + c).join('');
    }

    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000' : '#fff';
}

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
                                    <div
                                        className="item text-center cursor"
                                        style={{
                                            background: cat.color,
                                            color: getContrastTextColor(cat.color),
                                        }}
                                    >
                                        <img src={cat.images[0]} alt='' className='w-100 h-100 mb-1' />
                                        <h6 className='fw-500 mb-0'>{cat.name}</h6>
                                    </div>
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