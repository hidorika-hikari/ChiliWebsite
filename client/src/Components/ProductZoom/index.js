import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'react-inner-image-zoom/lib/styles.min.css';
import InnerImageZoom from 'react-inner-image-zoom';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';

const ProductZoom = (props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="productZoom mb-3">
            
            <Swiper
                modules={[Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                spaceBetween={10}
                slidesPerView={1}
                className="zoomSliderBig"
            >
                {props?.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className='badge badge-primary'>{props?.discount}</div>
                        <InnerImageZoom
                            zoomType="hover"
                            zoomScale={1}
                            src={img}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Navigation, Thumbs]}
                spaceBetween={10}
                slidesPerView={3}
                navigation
                watchSlidesProgress
                className="zoomSlider"
            >
                {props?.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img src={img} alt="" className="thumbnail" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductZoom;