import '../../assets/css/home.css'
import banner01 from '../../assets/images/home/b01.jpg'
import banner02 from '../../assets/images/home/b02.jpg'
import banner03 from '../../assets/images/home/b03.jpg'
import kingIMG from '../../assets/images/home/King.gif'


import { useCallback, useEffect, useRef, useState } from 'react'
import callAPI from '../../axios'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import axios from 'axios'


const slide = [banner01, banner02, banner03]

const live = []
for (let index = 0; index < 100; index++) {
  live.push(index)
}


export default function Home() {
  const history = useHistory()
  
  const [ActiveSlide, setActiveSlide] = useState(0)
  const [Dashboard, setDashboard] = useState({})
  const [MarketCap, setMarketCap] = useState({})
  
  useMemo(() => {
    callAPI.get('/dashboard')
    .then(res => {
      setDashboard(res.data)
    })
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=kingdom-game-4-0')
    .then(res => {
      setMarketCap(res.data[0])
    })
  },[])
  
  const timeout = useRef(null)
  useEffect(() => {
    timeout.current = setTimeout(() => {
      console.log(slide.length)
      if (ActiveSlide < slide.length - 1) {
        setActiveSlide(ActiveSlide + 1)
      } else {
        setActiveSlide(0)
      }
    }, 5000)
  }, [ActiveSlide])

  const manualChangeSlide = useCallback((index) => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    setActiveSlide(index)
  }, [])

 

  
  return (
    <>
      <div className='home'>
        {/* ------------------------div: slider -----------------------*/}
        <div className='slide-track'>
          <div
            style={{ '--translate': -(100 / slide.length) * ActiveSlide + '%' }}
            className='slide'
          >
            {slide.map((o) => (
              <div className='item'>
                <img src={o} alt='' />
              </div>
            ))}
          </div>
          <div className='controls'>
            {slide.map((o, index) => (
              <div
                onClick={() => manualChangeSlide(index)}
                className={`btn ${ActiveSlide === index ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>{/* ------------------------ e:slider -----------------------*/}

        <div className='container home_container'>
          {/* ------------------------div: split -----------------------*/}
          <div className='split'>
            <span className='kinglive_vector'></span >
            <h3>For passionate community of streamers, gamers, fans & developers</h3>

            <ul className="home_navigator">
              <li><span onClick={()=>history.push('/setup')} className='_transit'>Livestreaming</span><span className="shake"></span></li>
              <li><span onClick={()=>history.push('/mint-nft')} className='_transit'>Mint NFT</span><span className="shake"></span></li>
              <li><span onClick={()=>history.push('/live')} className='_transit'>Donate</span><span className="shake"></span></li>
              <li><span onClick={()=>history.push('/nft-market')} className='_transit'>Buy/Sell/Auction NFT</span><span className="shake"></span></li>
            </ul>
          </div>{/* --- e:split -----------------------*/}

          {/* ------------------------div: split -----------------------*/}
          <div className='split'>
            <img className='king_IMG'
              src={kingIMG}
              alt="kinglive images"
            />
          </div>{/* --- e:split -----------------------*/}

          {/* ------------------------div: split -----------------------*/}
          <div className='split info_box'>
            <span>Number of streamers<strong>{Dashboard.total_stream}</strong></span>
            <span>Number of videos<strong>{Dashboard.total_video}</strong></span>
            <span>Number of hours watched<strong>{Dashboard.watched_time}</strong></span>
            <span>Number of views<strong>{Dashboard.total_views}</strong></span>
            
          </div>{/* --- e:split -----------------------*/}

          {/* ------------------------div: split -----------------------*/}
          <div className='split info_box'>
            <span>Minted NFT<strong>{Dashboard.minted_nft}</strong></span>
            <span>NFT transaction<strong>{Dashboard.transaction}</strong></span>
            <span>NFT Trading volume<strong>{Dashboard.volumn_transaction}</strong></span>
            <span>Volume donate<strong>{Dashboard.watched_time}</strong></span>
           
          </div>{/* --- e:split -----------------------*/}


        </div>{/* --- e:home_container -----------------------*/}

        <div className='bottom_line'>
          <div className='container'>
            <span>Total supply:<strong>988,125,000 KDG</strong></span>
            <span>Circulating:<strong>{MarketCap.circulating_supply}</strong></span>
            <span>Marketcap:<strong>{MarketCap.market_cap}</strong></span>

          </div>{/* --- e:bottom_line -----------------------*/} 
        </div>{/* --- e:bottom_line -----------------------*/}  
      </div>{/* --- e:home -----------------------*/}
    </>
  )
}
