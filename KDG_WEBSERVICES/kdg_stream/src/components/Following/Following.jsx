import React, { useState, useEffect } from 'react';
import '../../assets/css/following.css';

import * as IoIcon from 'react-icons/io';

import { useHistory } from 'react-router-dom';
import { smoothscroll } from '../../helpers';
import useWindowSize from '../../hooks/useWindowSize';
import avatarDefault from '../../assets/images/avatarDefault.svg';

const widthItem = 60;
const gapItem = 30;
const numberItem = 20;

const Following = () => {
  const [width] = useWindowSize();
  const history = useHistory();
  const [widthFollowing, setWidthFollowing] = useState(0);
  const [widthScroll, setWidthScroll] = useState(0);
  const [numberScroll, setNumberScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let track = document.querySelector('.followingTrack');
    let widthTrack = track.offsetWidth;
    let itemPerScreen = widthTrack / (widthItem + gapItem);

    let widthFollowing = numberItem * widthItem + (numberItem - 1) * gapItem;
    setWidthFollowing(widthFollowing);
    let widthScroll = itemPerScreen * widthItem + (itemPerScreen - 1) * gapItem;
    setWidthScroll(widthScroll);
    let numberScroll = Math.floor(widthFollowing / widthScroll);
    setNumberScroll(numberScroll);
  }, [width]);

  useEffect(() => {
    let track = document.querySelector('.followingTrack');
    if (track) {
      let item = track.querySelector('.following__item');
      if (item) {
        smoothscroll(track, track.scrollLeft, widthScroll * activeIndex, 0, 0, 300);
      }
    }
  }, [activeIndex, widthScroll]);

  return (
    <div className='position-relative userSelect-none pl-50 pr-50'>
      <IoIcon.IoIosArrowDropleft
        className={`controlButton followingButtonLeft ${activeIndex > 0 ? 'show' : ''}`}
        onClick={() => setActiveIndex(activeIndex - 1)}
      />
      <IoIcon.IoIosArrowDropright
        className={`controlButton followingButtonRight ${activeIndex < numberScroll ? 'show' : ''}`}
        onClick={() => setActiveIndex(activeIndex + 1)}
      />
      <div className='followingTrack p-10'>
        <div
          className='following'
          style={{
            '--width-item': `${widthItem}px`,
            '--width-following': `${widthFollowing}px`,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(el => (
            <div
              key={el}
              className='following__item active'
              onClick={() => history.push('/profile')}
            >
              <img src={avatarDefault} alt='' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Following;
