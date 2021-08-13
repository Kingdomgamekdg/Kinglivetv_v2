import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import "swiper/components/navigation/navigation.min.css"
import SwiperCore, {Navigation , Lazy} from 'swiper/core';
import arrowLeft from '../../assets/images/nft-market/arrow-left.png'
import imgSlide from '../../assets/images/nft-market/img-slide.png'
import zoom from '../../assets/images/nft-market/zoom.png'
import ArtistDetail from './ArtistDetail'
import TradingHistory from './TradingHistory'
import Bidding from './Bidding'
import "./style.css";
import address from '../../assets/images/nft-market/Vector.png'

const MyArtworkDetail = () => {
    SwiperCore.use([Navigation , Lazy]);
    const contentSwiper = (
        <>
            <div className="item-swiper-content">
                <img src={imgSlide} alt="" />
            </div>
        </>
    )
    return (
                <>
                    <div className="main-wrapper">
                    <div className="box-slide-artwork">
                        <div className="box-return">
                            <img src={arrowLeft} alt="" /> 
                            <span className="text-return">The World NFT Set Up In My Mind</span>
                        </div>
                        <Swiper
                            centeredSlides={true}
                            centered
                            loop={true}
                            lazy={true}
                            navigation={true}
                            spaceBetween={0}
                            slidesPerView={1}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                            >
                            <SwiperSlide>{contentSwiper}</SwiperSlide>
                        </Swiper>
                        <div className="box-img">
                            <img src={zoom} alt="" />
                        </div>
                    </div>
                    <div className="box-slide-artwork">
                        <div className="box-return">
                            <img src={arrowLeft} alt="" /> 
                            <span className="text-return">The World NFT Set Up In My Mind</span>
                        </div>
                        <Swiper
                            centeredSlides={true}
                            centered
                            loop={true}
                            lazy={true}
                            navigation={true}
                            spaceBetween={0}
                            slidesPerView={1}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                            >
                            <SwiperSlide>{contentSwiper}</SwiperSlide>
                        </Swiper>
                        <div className="box-img">
                            <img src={zoom} alt="" />
                        </div>
                    </div>
                    </div>
                </>
    )
}
export default MyArtworkDetail