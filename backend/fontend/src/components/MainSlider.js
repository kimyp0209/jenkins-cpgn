import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './common.css';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

function MainSlider() {
    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
                autoplay={{ delay: 4000 }}
                pagination={{
                    el: '.swiper-pagination',
                    type: 'progressbar',
                    
                }}
                navigation={{
    nextEl: '.custom-swiper-button-next',
    prevEl: '.custom-swiper-button-prev',
  }}
                className="main-swiper"
            >
                <SwiperSlide>
                    <div className="slide" style={{ backgroundImage: `url(/img/main01.jpg)` }}></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide" style={{ backgroundImage: `url(/img/main02.jpg)` }}></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide" style={{ backgroundImage: `url(/img/main03.jpg)` }}></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide" style={{ backgroundImage: `url(/img/main04.jpg)` }}></div>
                </SwiperSlide>
            </Swiper>
            <div className="swiper-bottom-wrapper">
  <div className="swiper-pagination swiper-pagination-progressbar"></div>
  <div className="swiper-arrows">
    <div className="custom-swiper-button-prev"></div> {/* 수정됨 */}
    <div className="custom-swiper-button-next"></div> {/* 수정됨 */}
  </div>
</div>
        </>
    );
}

export default MainSlider;
