import React from 'react';

export default function ListChart() {
  return (
    <>
      <div className='item va-t'>
        <div className='price'>
          <coingecko-coin-price-chart-widget
            coin-id='kingdom-game-4-0'
            currency='usd'
            height='300'
            locale='en'
          ></coingecko-coin-price-chart-widget>
        </div>
      </div>
      <div className='item va-t'>
        <div className='price'>
          <coingecko-coin-price-chart-widget
            coin-id='bitcoin'
            currency='usd'
            height='300'
            locale='en'
          ></coingecko-coin-price-chart-widget>
        </div>
      </div>
      <div className='item va-t'>
        <div className='price'>
          <coingecko-coin-price-chart-widget
            coin-id='ethereum'
            currency='usd'
            height='300'
            locale='en'
          ></coingecko-coin-price-chart-widget>
        </div>
      </div>
      <div className='item va-t'>
        <div className='price'>
          <coingecko-coin-price-chart-widget
            coin-id='tron'
            currency='usd'
            height='300'
            locale='en'
          ></coingecko-coin-price-chart-widget>
        </div>
      </div>
    </>
  );
}
