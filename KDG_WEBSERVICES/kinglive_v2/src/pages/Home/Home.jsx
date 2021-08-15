import '../../assets/css/home.css'
import banner01 from '../../assets/images/home/b01.jpg'
import banner02 from '../../assets/images/home/b02.jpg'
import banner03 from '../../assets/images/home/b03.jpg'
import kingIMG from '../../assets/images/home/King1.png'


import { useCallback, useEffect, useRef, useState } from 'react'
import callAPI from '../../axios'
import emptyGift from '../../assets/svg/emptyGift.svg'
import coverDefault from '../../assets/svg/coverDefault.jpg'
import avatarDefault from '../../assets/svg/avatarDefault.svg'
import { STORAGE_DOMAIN } from '../../constant'
import convertDateAgo from '../../helpers/convertDateAgo'




const slide = [banner01, banner02, banner03]

const live = []
for (let index = 0; index < 100; index++) {
  live.push(index)
}


export default function Home() {

  
  const [ActiveSlide, setActiveSlide] = useState(0)
  const [ActiveLive, setActiveLive] = useState(0)
  
  
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

  const handlePlusSlideLive = useCallback(() => {
    setActiveLive((_active) => {
      if (_active === live.length - 1) return 0
      return _active + 1
    })
  }, [])
  const handleMinusSlideLive = useCallback(() => {
    setActiveLive((_active) => {
      if (_active === 0) return live.length - 1
      return _active - 1
    })
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
            <a href='#' className='kinglive_vector'></a >
            <h3>For passionate community of streamers, gamers, fans & developers</h3>

            <ul className="home_navigator">
              <li><a href="#" className='_transit'>Livestreaming</a><span></span></li>
              <li><a href="#" className='_transit'>Mint NFT</a><span></span></li>
              <li><a href="#" className='_transit'>Donate</a><span></span></li>
              <li><a href="#" className='_transit'>Buy/Sell/Auction NFT</a><span></span></li>
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
            <span>Number of streamers<strong>2 million</strong></span>
            <span>Number of videos<strong>2 million</strong></span>
            <span>Number of hours watched<strong>2 million</strong></span>
            <span>Number of views<strong>2 million</strong></span>
            
          </div>{/* --- e:split -----------------------*/}

          {/* ------------------------div: split -----------------------*/}
          <div className='split info_box'>
            <span>Minted NFT<strong>2 million</strong></span>
            <span>NFT transaction<strong>2 million</strong></span>
            <span>NFT Trading volume<strong>2 million</strong></span>
            <span>Volume donate<strong>2 million</strong></span>
           
          </div>{/* --- e:split -----------------------*/}


        </div>{/* --- e:home_container -----------------------*/}

        <div className='bottom_line'>
          <div className='container'>
            <span>Total supply:<strong>2 million</strong></span>
            <span>Circulating:<strong>2 million</strong></span>
            <span>Marketcap:<strong>2 million</strong></span>

          </div>{/* --- e:bottom_line -----------------------*/} 
        </div>{/* --- e:bottom_line -----------------------*/}  
      </div>{/* --- e:home -----------------------*/}
    </>
  )
}
