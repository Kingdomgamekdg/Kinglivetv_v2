import { Tab, TabPane } from '../../components';
import { useLanguage } from '../../context/LanguageLayer';
import Asset from './Asset';
import Personal from './Personal';
import TopDonate from './TopDonate';

export default function MainContainer({ uid, user, UserOwner, videoStreamming }) {
  const [{ language, profile }] = useLanguage();

  return (
    <div className='container'>
      {uid === user?._id && (
        <Tab>
          <TabPane name={profile[language].personal} key='1'>
            <Personal UserOwner={UserOwner} videoStreamming={videoStreamming} />
          </TabPane>

          <TabPane name={profile[language].asset} key='2'>
            <Asset />
          </TabPane>

          <TabPane name={profile[language].topDonate} key='3'>
            <TopDonate />
          </TabPane>
        </Tab>
      )}

      {uid !== user?._id && <Personal UserOwner={UserOwner} />}
    </div>
  );
}
