import React from 'react';
import '../../assets/css/table.css';
import nodataIMG from '../../assets/images/nodata.svg';

const Table = ({ dataHead, dataBody }) => {
  return (
    <table className='table'>
      <thead>
        <tr>
          {dataHead.map(o => (
            <td key={o.key} style={o.style.width ? { width: o.style.width } : {}}>
              {o.name}
            </td>
          ))}
        </tr>
      </thead>

      {dataBody.length > 0 && (
        <tbody>
          {dataBody.map((obj, i) => (
            <tr key={obj._id}>
              {dataHead.map(o => (
                <td
                  key={o.key}
                  style={o.style || {}}
                  onClick={
                    typeof o.onClick === 'function'
                      ? o.onClick(obj[o.key], obj, dataBody)
                      : () => {}
                  }
                >
                  {typeof o.render === 'function'
                    ? o.render(obj[o.key], obj, dataBody, i)
                    : obj[o.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      )}

      {dataBody.length === 0 && (
        <tbody>
          <tr>
            <td colSpan='100%' style={{ paddingTop: '25px', paddingBottom: '25px' }}>
              <img style={{ display: 'block', margin: '0 auto' }} src={nodataIMG} alt='' />
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
};
export default Table;
