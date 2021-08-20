import { useEffect } from 'react'
import '../../assets/scss/sidebar.scss'
import home from '../../assets/images/sidebar/home.svg'
import homeactive from '../../assets/images/sidebar/homeactive.svg'
import live from '../../assets/images/sidebar/live.svg'
import liveactive from '../../assets/images/sidebar/liveactive.svg'
import market from '../../assets/images/sidebar/market.svg'
import marketactive from '../../assets/images/sidebar/marketactive.svg'
import swap from '../../assets/images/sidebar/swap.svg'
import swapactive from '../../assets/images/sidebar/swapactive.svg'
import more from '../../assets/images/sidebar/more.svg'
import moreactive from '../../assets/images/sidebar/moreactive.svg'
import { useHistory, useLocation } from 'react-router'

const state = {
  isChecked: true,
};

const page = [
  {
    route: '/',
    name: 'Home',
    icon: home,
    active: homeactive,
  },
  {
    route: '/live',
    name: 'Livestream',
    icon: live,
    active: liveactive,
  },
  {
    route: '/nft-market',
    name: 'NFT Market',
    icon: market,
    active: marketactive,
    child: [
      {
        route: '/nft-market',
        name: 'NFT Market',
      },
      {
        route: '/my-artwork',
        name: 'My NFT Artwork',
      },
      {
        route: '/mint-nft',
        name: 'Mint NFT',
      }
    ],
  },
  {
    route: '/swap',
    name: 'Swap',
    icon: swap,
    active: swapactive,
  },
  {
    route: '/more',
    name: 'More',
    icon: more,
    active: moreactive,
    child: [
      {
        route: '/Audit',
        name: 'Audit',
      },
      {
        route: '/Docs',
        name: 'Docs',
      },
      {
        route: '/Github',
        name: 'Github',
      },
    ],
  },
]

export default function Sidebar({ IsOpenSidebar }) {
  useEffect(() => {
    const headerHeight = document.querySelector('header').offsetHeight
    const aside = document.querySelector('aside')
    aside.style.height = window.innerHeight - headerHeight + 'px'
    aside.style.top = headerHeight + 'px'
  }, [])

  useEffect(() => {
    const child_menu = document.querySelectorAll('aside .child')
    child_menu.forEach((el) => {
      const nextElement = el.parentElement.nextElementSibling
      if (nextElement) {
        nextElement.style.marginTop = el.offsetHeight + 'px'
        if (IsOpenSidebar) {
          nextElement.style.marginTop = el.offsetHeight + 'px'
        } else {
          nextElement.style.marginTop = 0 + 'px'
        }
      }
    })
  }, [IsOpenSidebar])

  

  const location = useLocation()
  const history = useHistory()

  return (
    <>
      <aside className={`${IsOpenSidebar ? 'large' : ''}`}>
        {page.map((o) => (
          <div
            key={o.route}
            onClick={() => history.push(o.route)}
            className={`item _transit ${location.pathname === o.route ? 'active' : ''}`}
          >
            <img src={location.pathname === o.route ? o.active : o.icon} alt='' />
            <span>{o.name}</span>
            {/*---------btn:arrow onclick show/hide child_box---------*/}
            {o.child && (              
              
              <div className='child'>
                
                {o.child.map((child) => (
                  <div
                    key={child.route}
                    onClick={(e) => {
                      e.stopPropagation()
                      history.push(child.route)
                    }}
                    className='child-item _transit'
                  >
                    <span>{child.name}</span>
                  </div>
                ))}
              </div>
            )}{/*-----e:child------ */}  
          </div>
        ))}
        {/*---------bottom box:arrow onclick show/hide child_box---------*/}

        <div className="bottom_box">
          <span className="setting_ico" ></span>
          <div>
            <span className="coin_KDG"></span>
            <p>12,370</p>
          </div>

          <div>
            <form>
              <label class="switch" id="display_mode">
                <input type="checkbox" 
                  defaultChecked={state.isChecked}
                  />
                <span class="slider round"></span>
              </label>{/*---e:display_mode---*/}      
            </form>
          </div>

        </div>{/*-----e:bottom_box------ */}  
      </aside>
    </>
  )
}
