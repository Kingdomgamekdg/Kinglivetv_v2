import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const MetaMask = () => {
  const [address, setAddress] = useState('');

  const history = useHistory();
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (user && user._id !== '5fa8c45516342d2ba8827eb5') {
      history.push('/');
    }
  }, [user, history]);

  const getAccount = useCallback(async () => {
    // Check window.ethereum !

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    setAddress(account);
  }, []);

  return (
    <div className='metamask'>
      <h1 className='mb-20'>MetaMask</h1>
      <button className='button-new-new mb-20' onClick={getAccount}>
        Connect Wallet
      </button>
      <h2>
        Address: <span className='showAccount'>{address}</span>
      </h2>
    </div>
  );
};

export default MetaMask;
