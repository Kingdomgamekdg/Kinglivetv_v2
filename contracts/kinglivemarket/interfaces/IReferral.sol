pragma solidity ^0.7.0;

interface IReferral {
    function getReferral(
        address user)
    external view returns (address);
}