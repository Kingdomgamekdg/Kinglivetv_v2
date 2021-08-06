import React from 'react';
import { Avatar } from '..';
import '../../assets/css/card.css';
import rank1 from '../../assets/images/card/rank1.svg';
import rank2 from '../../assets/images/card/rank2.svg';
import rank3 from '../../assets/images/card/rank3.svg';
import { useLanguage } from '../../context/LanguageLayer';
import useNumber from '../../hooks/useNumber';

const rank = [rank1, rank2, rank3];

const Card = props => {
  const {
    index = 0,
    type = 'KDG',
    amount = 0,
    name = 'User',
    avatar,
    avatarPos,
    onClick = null,
  } = props;

  const [{ language, home }] = useLanguage();

  const handleClick = () => onClick && onClick();

  return (
    <div onClick={handleClick} className='card'>
      <div className='card__avatar'>
        <Avatar src={avatar} position={avatarPos} />
      </div>

      <div className='card__info'>
        <p className='card__info-name'>{name}</p>
        <p className='card__info-amount'>
          {useNumber(amount)} {home[language][type]}
        </p>
      </div>

      <img className='card__icon' src={rank[index]} alt='' />
    </div>
  );
};

export default Card;
