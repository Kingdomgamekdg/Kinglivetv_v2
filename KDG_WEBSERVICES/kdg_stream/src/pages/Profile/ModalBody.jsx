import * as GoIcon from 'react-icons/go';
import { useSelector } from 'react-redux';
import '../../assets/css/profile.css';
import { Tab, TabPane } from '../../components';
import { useLanguage } from '../../context/LanguageLayer';
import ListImages from './ListImages';

export default function ModalBody() {
  const [{ profile, language }] = useLanguage();

  const uploadStatus = useSelector(state => state.uploadStatus);

  return (
    <Tab>
      <TabPane name={profile[language].choose_img}>
        <ListImages />
      </TabPane>
      <TabPane name={profile[language].upload_img}>
        <label htmlFor={uploadStatus?.label} className='upload-avatar'>
          <GoIcon.GoCloudUpload className='icon' />
        </label>
      </TabPane>
    </Tab>
  );
}
