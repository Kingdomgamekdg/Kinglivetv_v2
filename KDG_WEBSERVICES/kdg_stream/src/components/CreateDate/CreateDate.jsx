import React from 'react';
import { convertDate, convertDateAgo } from '../../helpers';

const CreateDate = props => {
  const { create_date = new Date() } = props;

  return (
    <span
      style={{ cursor: 'pointer', userSelect: 'none' }}
      data-current='ago'
      data-date={convertDate(create_date)}
      data-ago={convertDateAgo(create_date)}
      onClick={e => {
        e.stopPropagation();
        const el = e.target;
        const current = el.getAttribute('data-current');
        if (current === 'ago') {
          el.setAttribute('data-current', 'date');
          el.innerText = el.getAttribute('data-date');
        } else {
          el.setAttribute('data-current', 'ago');
          el.innerText = el.getAttribute('data-ago');
        }
      }}
    >
      {convertDateAgo(create_date)}
    </span>
  );
};

export default CreateDate;
