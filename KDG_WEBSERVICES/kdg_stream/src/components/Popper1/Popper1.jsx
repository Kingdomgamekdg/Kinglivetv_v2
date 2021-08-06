import React, { useState } from 'react';
import '../../assets/css/popper1.css';
import package1 from '../../assets/images/profile/package1.png';
import package2 from '../../assets/images/profile/package2.png';
import package3 from '../../assets/images/profile/package3.png';
import package4 from '../../assets/images/profile/package4.png';
import package5 from '../../assets/images/profile/package5.png';
import package6 from '../../assets/images/profile/package6.png';
import package7 from '../../assets/images/profile/package7.png';
import package8 from '../../assets/images/profile/package8.png';
import package9 from '../../assets/images/profile/package9.png';

const dataPackage = [
  package1,
  package2,
  package3,
  package4,
  package5,
  package6,
  package7,
  package8,
  package9,
];

const Popper1 = ({ type = 'changes', pack }) => {
  const [price, setPrice] = useState('');
  const [text, setText] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const filterPackage = dataPackage.filter(p => p !== pack);

  return (
    <div className='popper1' onClick={e => e.stopPropagation()}>
      <p className='popper1__title mb-20'>
        {type === 'changes' ? 'Changes' : 'Choose'} donate icon you want
      </p>

      <div className='layoutFlex layout-4' style={{ '--gap-column': '20px', '--gap-row': '15px' }}>
        {filterPackage.map((p, i) => (
          <div key={i} className='layoutFlex-item'>
            <div
              className={`popper1__package ${activeIndex === i ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <img src={p} alt='' />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className='popper1__title'>How much this Tier</p>
        <input
          autoFocus
          type='number'
          value={price}
          className='popper1__input'
          placeholder='Number'
          onChange={e => setPrice(e.target.value)}
        />
        <p className='popper1__text1'>NB</p>
      </div>

      <p className='popper1__title mt-10 mb-10'>Benefit</p>

      <div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Fill some text...'
        ></textarea>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }} className='mt-10'>
        <button type='button' className='popper1__finish'>
          Finish
        </button>
      </div>
    </div>
  );
};

export default Popper1;
