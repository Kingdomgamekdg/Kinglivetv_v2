import '../../assets/css/modal.css';

export default function Modal({ onCancle, title, visible, content }) {
  if (visible) {
    return (
      <div className='modal'>
        <div onClick={onCancle} className='modal__mask'></div>
        <div className='modal__body'>
          <p className='modal__title'>{title}</p>
          <div className='modal__content'>{content}</div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
