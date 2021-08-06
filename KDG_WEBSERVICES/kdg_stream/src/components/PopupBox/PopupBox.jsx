import React from 'react';
import '../../assets/css/popup-box.css';

const popupBody = (
  <div style={{ padding: '50px', fontSize: '22px', color: '#303030', textAlign: 'center' }}>
    Popup Body
  </div>
);

const PopupBox = props => {
  const { children = popupBody, onCancel = () => {} } = props;

  return (
    <div className='popupBox' onClick={e => e.stopPropagation()}>
      <div className='popupBox__mask' onClick={() => onCancel(false)}></div>

      <div className='popupBox__content'>{children}</div>
    </div>
  );
};

export default PopupBox;
