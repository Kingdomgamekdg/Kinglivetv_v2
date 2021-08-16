import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import "swiper/components/navigation/navigation.min.css"
import SwiperCore, {Navigation , Lazy} from 'swiper/core';
import arrowLeft from '../../assets/images/nft-market/arrow-left.png'
import imgSlide from '../../assets/images/nft-market/img-slide.png'
import zoom from '../../assets/images/nft-market/zoom.png'
import "./style.css";
import address from '../../assets/images/nft-market/Vector.png'
import avatar from '../../assets/images/nft-market/avatar.png'
import noData from '../../assets/images/nft-market/no-data.png'

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
                  
                    <div className="box-artist-wrapper">
                    <div className="artist-content">
                    <div className="artist-content-top">
                        <p className="text-artist">
                            Artists
                        </p>
                        <h2 className="title-artist">
                            The World NFT Set Up In My Mind
                        </h2>
                        <p className="desc-artist">
                            <span className="desc">
                                100,000 KDG
                            </span>
                            <span className="txt">
                                $1000
                            </span>
                            <span className="txt">
                                1 of 5
                            </span>
                        </p>
                    </div>
                    <div className="artist-content-body">
                        <div className="desciption-artist">
                            <p className="desc">
                                Artist: <span className="color-fff"> Esther Howard </span>
                            </p>
                            <p className="desc">
                                Size: <span className="color-fff"> 366x435px </span>
                            </p>
                            <p className="desc">
                                Created: <span className="color-fff"> May 3th, 2021</span>
                            </p>
                            <p className="desc mar-t-10">
                                Description: 
                                <span className="color-fff d-block mar-t-10"> 
                                    An NFT celebration of the immature mind and the original form of art.
                                </span>
                                <span className="color-fff d-block mar-t-10"> 
                                    NFT coins: BSCS, BNB, BAKE, CAKE
                                </span>
                                <span className="color-fff d-block mar-t-10"> 
                                    Channel: Shibainu
                                </span>
                                <span className="color-blue d-block mar-t-10"> 
                                    #characters #weapon #pat
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="artist-content-bottom">
                        <div className="artist-contract">
                            <div className="contract-item">
                                <p className="text-contract">
                                    NFT Contract ID:
                                </p>
                                <p className="address-contract">
                                    0x2433bE070...DdE34 <img src={address} alt="" /> 
                                </p>
                            </div>
                            <div className="contract-item">
                                <p className="text-contract">
                                    Token ID:
                                </p>
                                <p className="address-contract">
                                    0x2433bE070...DdE34 <img src={address} alt="" /> 
                                </p>
                            </div>
                            <div className="contract-item">
                                <p className="text-contract">
                                    Creator's Address:
                                </p>
                                <p className="address-contract">
                                    0x2433bE070...DdE34 <img src={address} alt="" /> 
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="artist-content-button">
                        <button type="button" className="btn-bid">
                            Bid
                        </button>
                    </div>
                    </div>
                </div>

                <div className="box-bidding">
                <div className="content-bidding">
                    <h2 className="title-bidding">
                        Bidding
                    </h2>
                    <div className="table-bidding">
                        <table>
                            <tr className="tr-1">
                                <th>
                                    Address
                                </th>
                                <th>
                                    Price
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="box-data">
                                        <div className="non-data">
                                            <img src={noData} alt="" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                </div>
                <div className="box-trading">
                <div className="content-trading">
                    <h2 className="title-trading">
                        Trading History
                    </h2>
                    <div className="table-history">
                        <table>
                            <tr className="tr-1">
                                <th>
                                    From / To
                                </th>
                                <th>
                                    Amount
                                </th>
                                <th>
                                    Price (KDG)
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <div className="info-user">
                                        <div className="avt">
                                            <img src={avatar} alt="" />
                                        </div>
                                        <div className="info">
                                            <span className="info-name">
                                                Esther Howard
                                            </span>
                                            <span className="info-date">
                                                05/10/2021
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    1
                                </td>
                                <td>
                                    100,000
                                </td>
                                <td>
                                    Donate
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="info-user">
                                        <div className="avt">
                                            <img src={avatar} alt="" />
                                        </div>
                                        <div className="info">
                                            <span className="info-name">
                                                Esther Howard
                                            </span>
                                            <span className="info-date">
                                                05/10/2021
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    1
                                </td>
                                <td>
                                    100,000
                                </td>
                                <td>
                                    Donate
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                </div>
                </div>
                </>
                   
    )
}
export default MyArtworkDetail