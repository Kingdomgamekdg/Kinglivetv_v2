import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SlideArtworkDetail from './SlideArtworkDetail'
import ArtistDetail from './ArtistDetail'
import TradingHistory from './TradingHistory'
import Bidding from './Bidding'
import "./style.css";

const MyArtworkDetail = () => {
    return (
        <>
            <div className="main-wrapper">
                <SlideArtworkDetail />
                <ArtistDetail />
                <TradingHistory />
                <Bidding />
            </div>
        </>
    )
}
export default MyArtworkDetail