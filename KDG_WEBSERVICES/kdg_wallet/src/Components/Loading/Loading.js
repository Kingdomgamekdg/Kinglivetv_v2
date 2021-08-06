import React from 'react';
import '../../assets/css/loading.scss';
import rotate1 from '../../assets/img/rotate-1.png';
import token from '../../assets/img/token.png';

export default function Loading() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 99,
          backgroundColor: 'rgba(0,0,0,.5)',
        }}
      >
        <div
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50% , -50%)' }}
          className='rotate-block'
        >
          <img className='rotate-left' src={rotate1} alt='' />
          <img className='middle' src={token} alt='' />
        </div>
      </div>
    </>
  );
}
