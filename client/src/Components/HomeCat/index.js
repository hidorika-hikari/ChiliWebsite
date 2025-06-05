import 'swiper/css';
import 'swiper/css/navigation';
import Chili from '../../assets/peper.png'
import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

const HomeCat = () => {
    const [itemBg, setItemBg] = useState([
        '#fffceb','#ecffec','#feefea','#fff3eb','#fff3ff','#f2fce4',
        '#feefea','#fffceb','#feefea','#ecffec','#feefea','#fff3eb',
        '#fff3ff','#f2fce4','#feefea','#fffceb','#feefea','#ecffec'
    ]);

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
                        itemBg?.map((item,index) => {
                            return (
                                <SwiperSlide>
                                    <div className="item text-center cursor" style={{background:item}}>
                                        <img src={Chili} alt=''/>
                                        <h6>Red Chili</h6>
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