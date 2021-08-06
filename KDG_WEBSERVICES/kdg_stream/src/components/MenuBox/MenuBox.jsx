import React, { useEffect, useState } from 'react';
import * as BiIcon from 'react-icons/bi';
import '../../assets/css/menu-box.css';
// import { rippleEffect } from '../../helpers';

const menuItem = (
  <div className='menuBox__menuItem'>
    <BiIcon.BiEditAlt className='icon' />
    Menu Item
  </div>
);

const MenuBox = props => {
  const { children = menuItem } = props;

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const hideMenu = () => setShowMenu(false);

    window.addEventListener('click', hideMenu);

    return () => window.removeEventListener('click', hideMenu);
  }, []);

  return (
    <div
      className='menuBox'
      onClick={e => {
        e.stopPropagation();
        setShowMenu(x => !x);
      }}
    >
      {/* <div className='rippleBox' onClick={rippleEffect}></div> */}

      <BiIcon.BiDotsVerticalRounded className='menuBox__icon' />

      <div className={`menuBox__menuList ${showMenu ? 'show' : ''}`}>{children}</div>
    </div>
  );
};

export default MenuBox;
