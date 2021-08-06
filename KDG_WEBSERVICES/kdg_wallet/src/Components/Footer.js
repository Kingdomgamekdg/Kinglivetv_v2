import React from 'react';

export default function Footer() {
  return (
    <>
      <footer className='footer'>
        <div className='kdg-container'>
          <div className='kdg-row top-footer'>
            <div className='kdg-col-4 left'>
              <a className='logo' href='/'>
                <img alt='KingDomGame' src='https://storage.kingdomgame.org/upload/5f3c80e7f150a43976d10bc4.png' />
              </a>
              <div>
                <p>KINGDOM VENTURES.,LTD</p>
                <p>
                  <svg
                    width='0.75em'
                    aria-hidden='true'
                    focusable='false'
                    data-prefix='fas'
                    data-icon='map-marker'
                    className='svg-inline--fa fa-map-marker fa-w-12'
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 384 512'
                    color='#fac800'
                  >
                    <path
                      fill='currentColor'
                      d='M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z'
                    />
                  </svg>
                  141 Middle Road, GSM building #06-05 Singapore 188976
                </p>
                <p style={{ marginTop: '14px' }}>
                  <svg
                    width='1em'
                    aria-hidden='true'
                    focusable='false'
                    data-prefix='fas'
                    data-icon='envelope'
                    className='svg-inline--fa fa-envelope fa-w-16'
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                    color='#fac800'
                  >
                    <path
                      fill='currentColor'
                      d='M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z'
                    />
                  </svg>
                  contact@kingdomgame.co
                </p>
              </div>
              <div className='social'>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-block'
                  href='https://www.facebook.com/KingdomGameGlobal'
                >
                  <img alt='' src='https://storage.kingdomgame.org/upload/5f3c88dcf150a43976d10bcd.png' />
                </a>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-block'
                  href='https://twitter.com/KingdomGame_KDG'
                >
                  <img alt='' src='https://storage.kingdomgame.org/upload/5f40945448ad3f09bbfdc2d1.png' />
                </a>
                <a target='_blank' rel='noopener noreferrer' className='social-block' href='https://t.me/kdg_ann'>
                  <img alt='' src='https://storage.kingdomgame.org/upload/5f40945448ad3f09bbfdc2d0.png' />
                </a>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-block'
                  href='https://medium.com/kingdom-game-4-0'
                >
                  <img alt='' src='https://storage.kingdomgame.org/upload/5f40953348ad3f09bbfdc2d3.svg' />
                </a>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-block'
                  href='https://www.youtube.com/channel/UCl7ezf4kJUxjlPJwaoPtapA/featured'
                >
                  <img alt='' src='https://storage.kingdomgame.org/upload/5f40945448ad3f09bbfdc2d2.png' />
                </a>
              </div>
            </div>
            <div className='kdg-col-4 cate'></div>
            <div className='kdg-col-4 recive-email'>
              {/*
								<p className="title">{checkLanguage({vi : 'Nhận tin tức từ chúng tôi' , en : ''}, lang)}</p>
								<form>
									<input placeholder={checkLanguage(placeHolderInputName, lang)}/>
									<input placeholder={checkLanguage(placeHolderInputMail, lang)}/>
									<button type="submit">{checkLanguage(submitButton, lang)} </button>
								</form>
							*/}
            </div>
          </div>
        </div>
        <div className='bottom-footer'>Copyright © 2020 - KingdomGame.Org. All Rights Reserved</div>
      </footer>
    </>
  );
}
