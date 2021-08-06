import React, { useEffect, useRef } from 'react';
import * as IoIcon from 'react-icons/io';
import '../../assets/css/scroll-button.css';
import { scrollTop } from '../../helpers';

const ScrollButton = () => {
  const buttonRef = useRef();

  useEffect(() => {
    const handleScrollTop = () => {
      if (!buttonRef.current) return;

      if (window.scrollY === 0) {
        buttonRef.current.classList.remove('show');
      } else {
        buttonRef.current.classList.add('show');
      }
    };

    window.addEventListener('scroll', handleScrollTop);

    return () => window.removeEventListener('scroll', handleScrollTop);
  }, []);

  return (
    <div ref={buttonRef} className='scroll-button' onClick={scrollTop}>
      <IoIcon.IoIosArrowUp className='icon' />
    </div>
  );
};

export default ScrollButton;
