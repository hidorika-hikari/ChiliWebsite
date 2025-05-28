import { useRef } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import Slider from 'react-slick';

const ProductZoom = () => {

    const zoomSliderBig = useRef();
    const zoomSlider = useRef();
    
    var setting2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        arrows: false,
    };

    var setting = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        fade: false,
        arrows: true,
    };

    const goto = (index) => {
        zoomSlider.current.slickGoTo(index);
        zoomSliderBig.current.slickGoTo(index);
    }

    return (
        <div className="productZoom">
            <div className='productZoom position-relative'>
                <div className='badge badge-primary'>23%</div>
                <Slider {...setting2} className='zoomSliderBig' ref={zoomSliderBig}>
                        <div className='item'>
                            <InnerImageZoom
                            zoomType="hover" zoomScale={1}
                            src={`https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-55-768x691.jpg`}/>
                        </div>

                        <div className='item'>
                            <InnerImageZoom
                            zoomType="hover" zoomScale={1}
                            src={`https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image2-47-768x691.jpg`}/>
                        </div>

                        <div className='item'>
                            <InnerImageZoom
                            zoomType="hover" zoomScale={1}
                            src={`https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image3-35-768x691.jpg`}/>
                        </div>

                        <div className='item'>
                            <InnerImageZoom
                            zoomType="hover" zoomScale={1}
                            src={`https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-55-768x691.jpg`}/>
                        </div>
                </Slider>
            </div>
            <Slider {...setting} className='zoomSlider' ref={zoomSlider}>
                <div className='item'>
                    <img src='https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-55-768x691.jpg' 
                    className='w-100' onClick={() => goto(0)}/>
                </div>

                <div className='item'>
                    <img src='https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-55-768x691.jpg' 
                    className='w-100' onClick={() => goto(1)}/>
                </div>

                <div className='item'>
                    <img src='https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-55-768x691.jpg' 
                    className='w-100' onClick={() => goto(2)}/>
                </div>

                <div className='item'>
                    <img src='https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-55-768x691.jpg' 
                    className='w-100' onClick={() => goto(3)}/>
                </div>
            </Slider>
        </div>
    )
}

export default ProductZoom;