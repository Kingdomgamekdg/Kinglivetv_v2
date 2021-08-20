import { useHistory } from "react-router-dom"
import logoSVG from '../../assets/svg/logo.svg'

export default function LeftHeader({toggleSidebar ,IsOpenSidebar }) {
    const history = useHistory()
    return (
        <>
            <div className='left'>
                <div onClick={toggleSidebar} className={`toggle-menu ${IsOpenSidebar ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className='logo' onClick={() => history.push('/')}>
                    <img src={logoSVG} alt='' />
                </div>

                <div className='search-box'>
                    <svg
                        width='17'
                        height='17'
                        viewBox='0 0 17 17'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <circle
                            cx='7.66667'
                            cy='7.66667'
                            r='6.66667'
                            stroke='#C4C4C4'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                        <path
                            d='M16 16L12.375 12.375'
                            stroke='#C4C4C4'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </svg>

                    <input type='text' className='search' placeholder='Search' />
                </div>
            </div>
        </>
    )
}