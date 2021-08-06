import { useMemo, useState } from 'react';
import callAPI from '../../axios';
import { AssetBox, Table } from '../../components';
import { useLanguage } from '../../context/LanguageLayer';
import { convertBalance } from '../../helpers';

export default function TopDonate() {
  const [{ language, profile }] = useLanguage();
  const [TopDonateBody, setTopDonateBody] = useState([]);

  useMemo(() => {
    callAPI.get('/top_donate').then(res => {
      setTopDonateBody([...res.data]);
    });
  }, []);

  const topDonateHead = useMemo(() => {
    return [
      {
        key: '_id',
        name: profile[language].no,
        style: {
          width: '25%',
        },
        render: (_id, obj, array, index) => index + 1,
      },
      {
        key: 'from',
        name: 'Nickname',
        style: {
          width: '40%',
        },
        render: from => `${from.kyc.first_name} ${from.kyc.last_name}`,
      },
      {
        key: 'value',
        name: profile[language].total_kdg,
        style: {
          width: '35%',
          color: '#f52871',
          fontWeight: '500',
        },
        render: value => (
          <div>
            {convertBalance(value)} <span style={{ color: '#303030', fontWeight: 500 }}> KDG</span>
          </div>
        ),
      },
    ];
  }, [language, profile]);

  return (
    <>
      <AssetBox collapse={false}>
        <div className='pt-20 pb-20 pl-30 pr-30'>
          <div className='profile__table'>
            <Table dataHead={topDonateHead} dataBody={TopDonateBody} />
          </div>
        </div>
      </AssetBox>
    </>
  );
}
