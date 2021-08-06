export default function checkLang(text, language) {
  if (text && typeof text === 'object') {
    const listText = Object.entries(text);
    var text_vi;
    var text_en;
    listText.forEach(([key, value]) => {
      if (!key.includes('type')) {
        if (key.includes('vi')) {
          text_vi = value;
        }
        if (key.includes('en')) {
          text_en = value;
        }
      }
    });
    // const {text_en, text_vi} = text
    if (language === 'en') return text_en;
    if (language === 'vi') return text_vi;
  }
}
