const rippleEffect = e => {
  const effectEleArr = document.querySelectorAll('.rippleBox');

  let timeoutId;

  effectEleArr.forEach(effectEle => {
    if (!effectEle) return;

    // const { left, top } = effectEle.getBoundingClientRect();

    // let x = e.clientX - left;
    // let y = e.clientY - top;

    let rippleEle = document.createElement('span');
    rippleEle.classList.add('ripple');
    // rippleEle.style.left = x + 'px';
    // rippleEle.style.top = y + 'px';

    rippleEle.style.top = '50%';
    rippleEle.style.left = '50%';

    effectEle.appendChild(rippleEle);

    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => rippleEle.remove(), 400);
  });
};

export default rippleEffect;
