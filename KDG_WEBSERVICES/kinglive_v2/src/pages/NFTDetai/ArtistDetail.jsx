import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import address from '../../assets/images/nft-market/Vector.png'

const ArtistDetail = () => {
    return (
        <>
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
        </>
    )
}
export default ArtistDetail