import React, { useEffect, useRef, useState } from 'react';
import '../../assets/css/tab.css';
import smoothscroll from '../../helpers/smoothscroll';
import useWindowSize from '../../hooks/useWindowSize';

const Tab = props => {
  const firstRender = useRef(true);
  const [width] = useWindowSize();
  const { children, classHeader = '', classContent = '', gapColumn = '0px' } = props;
  const [tabHeader, setTabHeader] = useState([]);
  const [layout, setLayout] = useState('layout-2');
  const [childContent, setChildContent] = useState({});
  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [itemLeft, setItemLeft] = useState(0);

  useEffect(() => {
    const headers = [];
    const contents = {};

    React.Children.forEach(children, tabPane => {
      headers.push(tabPane.props.name);
      contents[tabPane.props.name] = tabPane.props.children;
    });

    setTabHeader(headers);
    setChildContent(contents);
    setLayout(`layout-${headers.length}`);

    if (firstRender.current) {
      setActive(headers[0]);
      setActiveIndex(0);
      firstRender.current = false;
    }
  }, [children]);

  useEffect(() => {
    if (activeIndex !== null) {
      var track = document.querySelector('.tab .tab__track');
      if (track) {
        var item = track.querySelector('.tab__content-child');
        if (item) {
          smoothscroll(track, track.scrollLeft, item.offsetWidth * activeIndex, 0, 0, 300);
        }
      }

      var item_headers = document.querySelectorAll('.tab__header-child');
      var item_header = item_headers[activeIndex];
      if (item_header) {
        setItemWidth(item_header.offsetWidth + 'px');
        setItemLeft(item_header.offsetLeft + 'px');
      }
    }
  }, [activeIndex, width]);

  const changeTab = name => {
    setActive(name);
    var find_index = tabHeader.findIndex(tab => tab === name);
    setActiveIndex(find_index);
  };

  return (
    <div className='tab'>
      <div
        className={`tab__header ${classHeader} layoutFlex ${layout}`}
        style={{
          '--item-width': itemWidth,
          '--item-left': itemLeft,
          '--gap-column': gapColumn,
        }}
      >
        {tabHeader?.map(name => (
          <div key={name} className='layoutFlex-item'>
            <div
              onClick={() => {
                changeTab(name);
              }}
              className={`tab__header-child ${name === active ? 'active' : ''}`}
            >
              <p>{name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='tab__track'>
        <div
          className={`tab__content ${classContent}`}
          style={{ '--item': tabHeader.length, '--active': activeIndex }}
        >
          {Object.keys(childContent)?.map(key => (
            <div key={key} className='tab__content-child'>
              {childContent[key]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tab;
