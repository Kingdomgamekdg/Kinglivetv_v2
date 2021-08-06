import React from 'react';
import { storage } from '../../helpers';

import wallet from '../../assets/img/wallet.png';
import gamehub from '../../assets/img/gamehub.png';
import live from '../../assets/img/live.png';
import walletbg from '../../assets/img/walletbg.jpg';
import gamehubbg from '../../assets/img/gamehubbg.jpg';
import livebg from '../../assets/img/livebg.jpg';

import { useLang } from '../../context/LanguageLayer';

export default function Services() {
  const [{ language, ServicesPageLanguage }] = useLang();
  const refresh = storage.getRefresh();

  return (
    <>
      <div className='form-block'>
        <div className='left'>
          <img alt='' src='/images/img-login2.png'></img>
        </div>
        <div className='right'>
          <div className='services'>
            <div
              onClick={() => window.open('https://wallet.kingdomgame.org?refresh=' + refresh)}
              className='service img img-3-1'
            >
              <img src={walletbg} alt='' />
              <div className='logo'>
                <img src={wallet} alt='' />
                <p className='des'>{ServicesPageLanguage[language].desc_wallet}</p>
              </div>
            </div>
            <div
              onClick={() => window.open('https://kinglive.tv?refresh=' + refresh)}
              className='service img img-3-1'
            >
              <img src={livebg} alt='' />
              <div className='logo'>
                <img src={live} alt='' />
                <p className='des'>{ServicesPageLanguage[language].desc_live}</p>
              </div>
            </div>
            <div className='service img img-3-1'>
              <img src={gamehubbg} alt='' />
              <div className='logo'>
                <img src={gamehub} alt='' />
                <p className='des'>{ServicesPageLanguage[language].desc_gamehub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
