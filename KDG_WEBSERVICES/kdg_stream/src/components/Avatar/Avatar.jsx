import '../../assets/css/avatar.css';
import avatarDefault from '../../assets/images/avatarDefault.svg';

export default function Avatar({ position, src = avatarDefault }) {
  return (
    <>
      <div className='avatar'>
        {src === avatarDefault ? (
          <img alt='' src={src} className='avatar__default' />
        ) : (
          <img
            className='avatar__real'
            alt=''
            src={src}
            style={{
              '--x': position?.x ? position.x * -1 + '%' : 0,
              '--y': position?.y ? position.y * -1 + '%' : 0,
              '--zoom': position?.zoom ? position.zoom + '%' : '100%',
            }}
          />
        )}
      </div>
    </>
  );
}
