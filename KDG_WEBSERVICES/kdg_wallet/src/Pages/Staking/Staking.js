import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/css/staking.scss';
import StakingHome from './StakingHome';
import StakingJoin from './StakingJoin';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Staking() {
  const coin = useQuery().get('coin');
  return <>{coin ? <StakingJoin /> : <StakingHome />}</>;
}
