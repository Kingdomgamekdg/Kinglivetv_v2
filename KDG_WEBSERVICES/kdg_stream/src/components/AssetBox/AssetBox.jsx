import React, { useState } from 'react';
import * as TiIcon from 'react-icons/ti';

const assetBody = (
  <div style={{ padding: '50px', fontSize: '22px', color: '#303030', textAlign: 'center' }}>
    Asset Body
  </div>
);

const AssetBox = props => {
  const { title = 'Asset Title', children = assetBody, collapse = true } = props;

  const [isShowBody, setIsShowBody] = useState(true);

  return (
    <div className='profile__assetBox'>
      {collapse && (
        <div className='profile__assetBox-header' onClick={() => setIsShowBody(x => !x)}>
          <div>{title}</div>
          <TiIcon.TiArrowSortedDown className={`icon ${isShowBody ? 'rotate' : ''}`} />
        </div>
      )}

      {isShowBody && <div className='profile__assetBox-body'>{children}</div>}
    </div>
  );
};

export default AssetBox;
