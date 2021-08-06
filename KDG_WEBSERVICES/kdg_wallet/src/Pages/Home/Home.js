import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';
import '../../assets/css/homewallet.scss';
import appstore from '../../assets/img/appstore.png';
import calender from '../../assets/img/calender.png';
import chplay from '../../assets/img/chplay.png';
import clock from '../../assets/img/clock.png';
import hightlineFunction from '../../assets/img/highline-function.png';
import hightlineFunction1 from '../../assets/img/highline-function1.png';
import homewalleticon1 from '../../assets/img/homewalleticon1.png';
import homewalleticon2 from '../../assets/img/homewalleticon2.png';
import homewalleticon3 from '../../assets/img/homewalleticon3.png';
import homewalleticon4 from '../../assets/img/homewalleticon4.png';
import hightlineFunctionImage from '../../assets/img/iconhomewallet.png';
import phone from '../../assets/img/phone-wallet.png';
import shield from '../../assets/img/shield.png';
import wallet from '../../assets/img/wallet.png';
import { useLang } from '../../context/LanguageLayer';
import { smoothscroll } from '../../helpers';

export default function Home() {
  const [{ language, HomePageLanguage }] = useLang();

  const loadedList = useCallback(() => {
    var listTitle = document.querySelectorAll(
      '.highline-function.bottom .list-something .something .title'
    );
    var heightest = 0;
    listTitle.forEach(el => {
      if (el.offsetHeight > heightest) heightest = el.offsetHeight;
    });
    listTitle.forEach(el => {
      el.style.height = heightest + 'px';
    });

    var list = document.querySelectorAll('.highline-function.bottom .list-something .something');
    heightest = 0;
    list.forEach(el => {
      if (el.offsetHeight > heightest) heightest = el.offsetHeight;
    });
    list.forEach(el => {
      el.style.height = heightest + 'px';
    });
  }, []);

  const handleClickTop = useCallback(type => {
    var track = document.querySelector('.highline-function.top .list-track');
    var itemWidth = track.querySelector('.highline-function.top .item').offsetWidth;
    if (type === 0) {
      var targetLeft = Math.floor(track.scrollLeft / itemWidth - 0.0001) * itemWidth;
      if (targetLeft < 0) {
        targetLeft = track.scrollWidth;
      }
      smoothscroll(track, track.scrollLeft, targetLeft, 0, 0, 200);
    }
    if (type === 1) {
      var targetRight = Math.ceil(track.scrollLeft / itemWidth + 0.0001) * itemWidth;
      if (targetRight >= track.scrollWidth) {
        targetRight = 0;
      }
      smoothscroll(track, track.scrollLeft, targetRight, 0, 0, 200);
    }
  }, []);

  const handleClickBottom = useCallback(type => {
    var track = document.querySelector('.highline-function.bottom .list-track');
    var itemWidth = track.querySelector('.highline-function.bottom .item').offsetWidth;
    if (type === 0) {
      var targetLeft = Math.floor(track.scrollLeft / itemWidth - 0.0001) * itemWidth;
      if (targetLeft < 0) {
        targetLeft = track.scrollWidth;
      }
      smoothscroll(track, track.scrollLeft, targetLeft, 0, 0, 200);
    }
    if (type === 1) {
      var targetRight = Math.ceil(track.scrollLeft / itemWidth + 0.0001) * itemWidth;
      if (targetRight >= track.scrollWidth) {
        targetRight = 0;
      }
      smoothscroll(track, track.scrollLeft, targetRight, 0, 0, 200);
    }
  }, []);

  return (
    <>
      <div className='kdg-container'>
        <div className='homewallet'>
          <div className='kdg-row'>
            <div className='kdg-col-6 left va-t'>
              <h1 className='title'>KING WALLET</h1>
              <p className='des'>{HomePageLanguage[language].title}</p>
              <ul>
                <li>{HomePageLanguage[language].desc1}</li>
                <li>{HomePageLanguage[language].desc2}</li>
                <li>{HomePageLanguage[language].desc3}</li>
              </ul>
              <div className='store'>
                <img
                  onClick={() => window.open('https://kingdomgame.org/download-ios')}
                  alt=''
                  src={appstore}
                />
                <img
                  onClick={() =>
                    window.open(
                      'https://play.google.com/store/apps/details?id=kingwallet.kingdomgame.org'
                    )
                  }
                  alt=''
                  src={chplay}
                />
              </div>
            </div>
            <div className='kdg-col-6 right va-t text-c'>
              <img alt='' src={phone} />
            </div>
          </div>
        </div>

        <div className='highline-function top'>
          <div className='top'>
            <img alt='' src={hightlineFunction1} />
            <h2>{HomePageLanguage[language].sub_title1}</h2>
            <p>{HomePageLanguage[language].sub_desc1_1}</p>
            <p>{HomePageLanguage[language].sub_desc1_2}</p>
          </div>
          <div className='bottom'>
            <div className='kdg-row'>
              <div className='kdg-col-6  va-m text-c'>
                <img className='image' src={hightlineFunctionImage} alt='' />
              </div>
              <div className='kdg-col-6 va-m text-c'>
                <div className='block-list-track'>
                  <FontAwesomeIcon
                    onClick={() => handleClickTop(0)}
                    size='2x'
                    className='arrow left'
                    icon={faChevronLeft}
                  />
                  <FontAwesomeIcon
                    onClick={() => handleClickTop(1)}
                    size='2x'
                    className='arrow right'
                    icon={faChevronRight}
                  />
                  <div className='list-track'>
                    <div className='kdg-row kdg-column-4 list-something'>
                      <div className='item'>
                        <div className='something'>
                          <img alt='' src={clock} />
                          <h3 className='title'>{HomePageLanguage[language].slide_title1}</h3>
                          <p className='des'>{HomePageLanguage[language].slide_desc1}</p>
                        </div>
                      </div>
                      <div className='item'>
                        <div className='something'>
                          <img alt='' src={wallet} />
                          <h3 className='title'>{HomePageLanguage[language].slide_title2}</h3>
                          <p className='des'>{HomePageLanguage[language].slide_desc2}</p>
                        </div>
                      </div>
                      <div className='item'>
                        <div className='something'>
                          <img alt='' src={shield} />
                          <h3 className='title'>{HomePageLanguage[language].slide_title3}</h3>
                          <p className='des'>{HomePageLanguage[language].slide_desc3}</p>
                        </div>
                      </div>
                      <div className='item'>
                        <div className='something'>
                          <img alt='' src={calender} />
                          <h3 className='title'>{HomePageLanguage[language].slide_title4}</h3>
                          <p className='des'>{HomePageLanguage[language].slide_desc4}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='highline-function bottom'>
          <div className='top'>
            <img alt='' src={hightlineFunction} />
            <h2>{HomePageLanguage[language].sub_title2}</h2>
            <p>{HomePageLanguage[language].sub_desc2_1}</p>
          </div>
          <div className='block-list-track'>
            <FontAwesomeIcon
              onClick={() => handleClickBottom(0)}
              size='2x'
              className='arrow left'
              icon={faChevronLeft}
            />
            <FontAwesomeIcon
              onClick={() => handleClickBottom(1)}
              size='2x'
              className='arrow right'
              icon={faChevronRight}
            />
            <div className='list-track'>
              <div onLoad={loadedList} className='kdg-row kdg-column-4 list-something'>
                <div className='item'>
                  <div className='something'>
                    <img alt='' src={homewalleticon1} />
                    <h3 className='title'>{HomePageLanguage[language].list_title1}</h3>
                    <p className='des'>{HomePageLanguage[language].list_desc1}</p>
                  </div>
                </div>
                <div className='item'>
                  <div className='something'>
                    <img alt='' src={homewalleticon2} />
                    <h3 className='title'>{HomePageLanguage[language].list_title2}</h3>
                    <p className='des'>{HomePageLanguage[language].list_desc2}</p>
                  </div>
                </div>
                <div className='item'>
                  <div className='something'>
                    <img alt='' src={homewalleticon3} />
                    <h3 className='title'>{HomePageLanguage[language].list_title3}</h3>
                    <p className='des'>{HomePageLanguage[language].list_desc3}</p>
                  </div>
                </div>
                <div className='item'>
                  <div className='something'>
                    <img alt='' src={homewalleticon4} />
                    <h3 className='title'>{HomePageLanguage[language].list_title4}</h3>
                    <p className='des'>{HomePageLanguage[language].list_desc4}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
